import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './schemas/users.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Put('/pic')
  @UseInterceptors(FileInterceptor('image'))
  updateProfilePic(
    @Req() req: any,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<User> {
    const userId = req.user.id;
    return this.usersService.updateProfilePic({ userId, image: image });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('follow')
  follow(@Req() req: any, @Body() data: { followedId: string }) {
    const userId: string = req.user.id;
    return this.usersService.follow(userId, data.followedId);
  }
}
