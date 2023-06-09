import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfilePicDto } from './dto/update-profile-pic.dto';
import { UpdateUserDetailsDto } from './dto/update-user-details.dto';
import { Follow } from './schemas/follows.schema';
import { UserDetails } from './schemas/user-details.schema';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Follow.name) private followModel: Model<Follow>,
    @InjectModel(UserDetails.name) private userDetailsModel: Model<UserDetails>,
    private fileService: FilesService,
    private jwtService: JwtService,
  ) { }

  async toggleOnlineByToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token);
    const user = await this.userModel.findById(payload.id).exec();

    if (user) {
      user.online = !user.online;
      await user.save();

      return user;
    }
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel(dto);

    const userDetails = new this.userDetailsModel({
      userId: user._id,
    });

    await user.save();
    await userDetails.save();

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { detailsId: userDetails._id },
    );

    await updatedUser.save();

    return this.userModel.findById(updatedUser._id);
  }

  async updateUserDetails(dto: UpdateUserDetailsDto): Promise<UserDetails> {
    const user = await this.userModel.findById(dto.userId);
    const userDetails = await this.userDetailsModel.findOneAndUpdate(
      { userId: user._id },
      { ...dto },
    );

    await userDetails.save();

    return this.userDetailsModel.findById(userDetails._id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = this.userModel.findOne({ email: email });
    return user;
  }

  async updateProfilePic(dto: UpdateProfilePicDto): Promise<User> {
    const fileName = await this.fileService.createFile(dto.image);
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: dto.userId },
      { profilePic: fileName },
    );
    updatedUser.save();

    return this.userModel.findById(updatedUser._id);
  }

  async follow(followerId: string, followedId: string): Promise<Follow> {
    const follow = new this.followModel({
      followedId: followedId,
      followerId: followerId,
    });

    return follow.save();
  }

  async getFollowedIds(userId: string) {
    const followed = await this.followModel.find({ followerId: userId }).exec();
    const followedIds = followed.map((follow: Follow) => follow.followedId);

    return followedIds;
  }

  async getFollowedUsers(userId: string): Promise<User[]> {
    const followedIds = await this.getFollowedIds(userId);

    return this.userModel.find({ _id: { $in: followedIds } });
  }

  async getFollowerUsers(userId: string): Promise<User[]> {
    const followers = await this.followModel
      .find({ followedId: userId })
      .exec();
    const followerIds = followers.map((follow: Follow) => follow.followerId);

    return this.userModel.find({ _id: { $in: followerIds } });
  }

  async suggestToFollow(userId: string): Promise<User[]> {
    const followedIds = await this.getFollowedIds(userId);
    return this.userModel
      .find({ _id: { $nin: followedIds } })
      .limit(5)
      .exec();
  }
}
