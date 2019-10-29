import { PostEntity } from 'src/post/post.entity';

export class UserResponseDTO {
  id: string;
  username: string;
  email: string;
  token?: string;
  created: Date;
  bookmarks?: PostEntity[];
}
