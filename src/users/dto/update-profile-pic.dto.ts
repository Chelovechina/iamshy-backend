export class UpdateProfilePicDto {
  readonly userId: string;
  readonly image: Express.Multer.File;
}
