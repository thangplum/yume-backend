import { UserResponseDTO } from 'src/user/dto/user-response.dto';

export class PostResponseDTO {
  id?: string;
  updated: Date;
  created: Date;
  caption: string;
  comment: string;
  commentRaw: string;
  author: UserResponseDTO;
  upvotes?: [string];
  downvotes?: [string];
  rating?: number;
  // replies?: Reply
}
