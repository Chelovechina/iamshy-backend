import {
  Controller,
  Req,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { Post as PostModel } from './schemas/posts.schema';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) { }

  @UseGuards(JwtAuthGuard)
  @Get('')
  getPosts() {
    return this.postsService.getPosts();
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('image'))
  createPost(
    @Req() req: any,
    @Body() data: { content: string },
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PostModel> {
    const userId = req.user.id;
    return this.postsService.createPost({
      ...data,
      userId: userId,
      image: image,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deletePost(@Req() req: any, @Param('id') id: string) {
    return this.postsService.deletePost(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/comment')
  getPostComments(@Param('id') id: string) {
    return this.postsService.getPostComments(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/comment')
  createComment(
    @Req() req: any,
    @Body() data: { content: string },
    @Param('id') id: string,
  ) {
    return this.postsService.createComment({
      ...data,
      userId: req.user.id,
      postId: id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id/comment/:commentId')
  deleteComment(@Req() req: any, @Param('commentId') commentId: string) {
    return this.postsService.deleteComment(commentId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/like')
  getPostLikes(@Param('id') id: string) {
    return this.postsService.getPostLikes(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/like')
  createLike(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.id;
    return this.postsService.createLike({ userId, postId: id });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id/like')
  deleteLike(@Req() req: any, @Param('id') id: string) {
    return this.postsService.deleteLike(id, req.user.id);
  }
}
