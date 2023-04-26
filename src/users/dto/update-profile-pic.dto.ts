export class UpdateProfilePicDto {
  readonly userId: number;
  readonly image: Express.Multer.File;
}
