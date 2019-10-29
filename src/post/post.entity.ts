import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ReplyEntity } from '../reply/reply.entity';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  caption: string;

  @Column('text')
  comment: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(type => UserEntity, author => author.posts)
  author: UserEntity;

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  likes: UserEntity[];

  @OneToMany(type => ReplyEntity, reply => reply.post, { cascade: true })
  replies: ReplyEntity[];
}
