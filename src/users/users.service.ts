import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfilePicDto } from './dto/update-profile-pic.dto';
import { UserDetails } from './schemas/user-details.schema';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserDetails.name) private userDetailsModel: Model<UserDetails>,
    private fileService: FilesService,
  ) { }

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel(dto);

    const userDetails = new this.userDetailsModel({
      userId: user._id,
    });

    await user.save();

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { detailsId: userDetails._id },
    );
    updatedUser.save();

    return this.userModel.findById(updatedUser._id);
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
}
