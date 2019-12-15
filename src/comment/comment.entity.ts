import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
  Index,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ReplyEntity } from '../reply/reply.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  comment: string;

  @CreateDateColumn()
  created: Date;

  @ManyToOne(type => UserEntity)
  @JoinTable()
  author: UserEntity;

  @Index()
  @ManyToOne(type => ReplyEntity, reply => reply.comments)
  reply: ReplyEntity;

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  likes: UserEntity[];
}
