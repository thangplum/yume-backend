import { IsString } from 'class-validator';

export class PostDTO {
  @IsString()
  caption: string;

  @IsString()
  comment: string;

  @IsString()
  commentRaw: string;
}
