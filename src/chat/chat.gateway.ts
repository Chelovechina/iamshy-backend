import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AddMessageDto } from './dto/add-message.dto';
import { Chat } from './schemas/chats.schema';

@WebSocketGateway(5000, {
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) { }

  @SubscribeMessage('createChat')
  async createChat(@MessageBody() data: string) {
    const members: string[] = JSON.parse(data);
    const chat: any = await this.chatService.createChat(members);

    this.server.emit(`chat`, chat);
  }

  @SubscribeMessage('sendMessage')
  async addMessage(@MessageBody() data: string) {
    const dto: AddMessageDto = JSON.parse(data);
    const chat: Chat = await this.chatService.addMessage(dto);
    console.log(chat);

    this.server.emit(`chat:${dto.chatId}`, chat);
  }

  @SubscribeMessage('getAllChats')
  async getUserChats(
    @MessageBody() userId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const chats = await this.chatService.getUserChats(userId);
    socket.emit('allChats', chats);
  }

  @SubscribeMessage('getChat')
  async getChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const chat = await this.chatService.getChat(chatId);
    socket.emit(`chat:${chatId}`, chat);
  }
}
