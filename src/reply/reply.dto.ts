import { IsString } from 'class-validator';

export class ReplyDTO {
  @IsString()
  comment: string;
}
