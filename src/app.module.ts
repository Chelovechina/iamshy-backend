import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ControllerService } from './module/controller/controller.service';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://root:cvNlc1v6Kr1FflnO@social.gwooslb.mongodb.net/?retryWrites=true&w=majority',
    ),
    UsersModule,
    PostsModule,
  ],
  controllers: [UsersController],
  providers: [ControllerService, PostsService],
})
export class AppModule { }
