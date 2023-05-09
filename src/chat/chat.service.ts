import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddMessageDto } from './dto/add-message.dto';
import { Chat } from './schemas/chats.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) { }

  async createChat(members: string[]): Promise<Chat> {
    const chat = new this.chatModel({ members, messages: [] });
    await chat.save();
    return chat;
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    const chats = await this.chatModel
      .find({ members: { $in: [userId] } })
      .populate('members', 'username', 'User')
      .populate('messages.sender', 'username', 'User')
      .exec();

    return chats;
  }

  async getChat(chatId: string): Promise<Chat> {
    return this.chatModel.findById(chatId);
  }

  async addMessage(dto: AddMessageDto): Promise<Chat> {
    const chat = await this.chatModel.findOneAndUpdate(
      { _id: dto.chatId },
      {
        $push: {
          messages: {
            sender: dto.senderId,
            content: dto.content,
            createdAt: new Date(),
          },
        },
      },
    );

    await chat.save();

    return this.chatModel.findById(chat._id);
  }
}
