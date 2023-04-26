export class CreatePostDto {
  readonly userId: string;
  readonly content: string;
  readonly image?: Express.Multer.File;
}
