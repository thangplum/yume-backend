import { UserResponseDTO } from 'src/user/dto/user-response.dto';

export class PostResponseDTO {
  id?: string;
  updated: Date;
  created: Date;
  caption: string;
  comment: string;
  author: UserResponseDTO;
  likes?: [string];
  numLikes?: number;
  // replies?: Reply
}
