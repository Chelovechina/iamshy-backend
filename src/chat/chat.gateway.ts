import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtWebSocketAuthGuard } from 'src/auth/jwt-websoket-auth.guard';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';
import { AddMessageDto } from './dto/add-message.dto';
import { Chat } from './schemas/chats.schema';

@WebSocketGateway(+process.env.WS_PORT || 5000, {
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
  ) { }

  @UseGuards(JwtWebSocketAuthGuard)
  async handleConnection(@ConnectedSocket() socket: any) {
    console.log(socket.handshake.auth.token);
    await this.usersService.toggleOnlineByToken(socket.handshake.auth.token);
  }

  @UseGuards(JwtWebSocketAuthGuard)
  async handleDisconnect(@ConnectedSocket() socket: any) {
    await this.usersService.toggleOnlineByToken(socket.handshake.auth.token);
  }

  @UseGuards(JwtWebSocketAuthGuard)
  @SubscribeMessage('createChat')
  async createChat(
    @ConnectedSocket() socket: any,
    @MessageBody() userId: string,
  ) {
    const members: string[] = [socket.userId, userId];
    const chat: any = await this.chatService.createChat(members);

    this.server.emit(`chat`, chat);
  }

  @UseGuards(JwtWebSocketAuthGuard)
  @SubscribeMessage('sendMessage')
  async addMessage(@MessageBody() data: string) {
    const dto: AddMessageDto = JSON.parse(data);
    const chat: Chat = await this.chatService.addMessage(dto);

    this.server.emit(`chat:${dto.chatId}`, chat);
  }

  @UseGuards(JwtWebSocketAuthGuard)
  @SubscribeMessage('getAllChats')
  async getUserChats(@ConnectedSocket() socket: any) {
    const chats = await this.chatService.getUserChats(socket.userId);
    socket.emit('allChats', chats);
  }

  @UseGuards(JwtWebSocketAuthGuard)
  @SubscribeMessage('getChat')
  async getChat(@MessageBody() chatId: string, @ConnectedSocket() socket: any) {
    const chat = await this.chatService.getChat(chatId);
    socket.emit(`chat:${chatId}`, chat);
  }
}
