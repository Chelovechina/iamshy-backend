import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateLikeDto } from './dto/create-like.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { Comment } from './schemas/comments.schema';
import { Like } from './schemas/likes.schema';
import { Post } from './schemas/posts.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Like.name) private likeModel: Model<Like>,
    private userService: UsersService,
    private fileService: FilesService,
  ) { }

  private async isUserLikedPost(userId: string): Promise<boolean> {
    const candidate = await this.likeModel.findOne({ userId: userId });
    return candidate === undefined ? false : true;
  }

  async createPost(dto: CreatePostDto): Promise<Post> {
    let fileName: string | null = null;

    if (dto.image !== undefined) {
      fileName = await this.fileService.createFile(dto.image);
    }

    const post = new this.postModel({ ...dto, image: fileName });
    return post.save();
  }

  async getPosts(userId: string): Promise<Post[]> {
    const followedIds = await this.userService.getFollowedIds(userId);
    return this.postModel.find({ userId: { $in: followedIds } }).exec();
  }

  async deletePost(postId: string, userId: string): Promise<Post> {
    const deletedPost = this.postModel.findOneAndDelete({
      _id: postId,
      userId: userId,
    });

    if (deletedPost !== undefined) return deletedPost;

    throw new HttpException(
      'Пользователь не является автором поста',
      HttpStatus.BAD_REQUEST,
    );
  }

  async getPostComments(postId: string): Promise<Comment[]> {
    return this.commentModel.find({ postId: postId }).exec();
  }

  async createComment(dto: CreateCommentDto): Promise<Comment> {
    const comment = new this.commentModel(dto);
    return comment.save();
  }

  async deleteComment(commentId: string, userId: string): Promise<Comment> {
    const deletedComment = this.commentModel.findOneAndDelete({
      _id: commentId,
      userId: userId,
    });

    if (deletedComment !== undefined) return deletedComment;

    throw new HttpException(
      'Комментария не существует или пользователь не является автором комментария',
      HttpStatus.BAD_REQUEST,
    );
  }

  async getPostLikes(postId: string): Promise<Like[]> {
    return this.likeModel.find({ postId: postId }).exec();
  }

  async createLike(dto: CreateLikeDto): Promise<Like> {
    const isLiked: boolean = await this.isUserLikedPost(dto.userId);
    if (isLiked) {
      throw new HttpException(
        'Пользователь уже поставил лайк',
        HttpStatus.BAD_REQUEST,
      );
    }

    const like = new this.likeModel(dto);
    return like.save();
  }

  async deleteLike(likeId: string, userId: string): Promise<Like> {
    const deletedLike = this.likeModel.findOneAndDelete({
      _id: likeId,
      userId: userId,
    });

    if (deletedLike !== undefined) return deletedLike;

    throw new HttpException(
      'Пользователь не является автором лайка',
      HttpStatus.BAD_REQUEST,
    );
  }
}
