import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from './schemas/chats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    UsersModule,
    AuthModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule { }
