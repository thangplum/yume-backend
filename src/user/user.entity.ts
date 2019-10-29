import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  BeforeUpdate,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserResponseDTO } from './dto/user-response.dto';
import { PostEntity } from '../post/post.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
    unique: true,
  })
  username: string;

  @Column({ type: 'text', select: true })
  password: string;

  @CreateDateColumn()
  created: Date;

  @OneToMany(type => PostEntity, post => post.author)
  posts: PostEntity[];

  @ManyToMany(type => PostEntity, { cascade: true })
  @JoinTable()
  bookmarks: PostEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toResponseObject(showToken: boolean = true): UserResponseDTO {
    const { id, created, username, token, email } = this;
    const responseObj: any = { id, created, username, email };
    if (showToken) {
      responseObj.token = token;
    }
    if (this.posts) {
      responseObj.posts = this.posts;
    }
    if (this.bookmarks) {
      responseObj.bookmarks = this.bookmarks;
    }
    return responseObj;
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  private get token() {
    const { id, username } = this;
    return jwt.sign(
      {
        id,
        username,
      },
      'projectxy',
      { expiresIn: '1d' },
    );
  }
}
