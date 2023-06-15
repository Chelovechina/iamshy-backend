import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtWebSocketAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth.token;

    if (!token) {
      throw new WsException('Токен не найден в WebSocket соединении');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      client.userId = payload.id;
      return true;
    } catch (err) {
      throw new WsException('Невалидный токен в WebSocket соединении');
    }
  }
}
