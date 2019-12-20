import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../user/user.entity';

@Entity('flag')
export class FlagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => PostEntity)
  post: PostEntity;

  @ManyToOne(type => UserEntity)
  author: UserEntity;

  @Column()
  reason: string;

  @CreateDateColumn()
  created: Date;
}
