import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
  JoinTable,
  OneToMany,
  ManyToMany,
  Index,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PostEntity } from '../post/post.entity';
import { CommentEntity } from '../comment/comment.entity';

@Entity('reply')
export class ReplyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column('text')
  comment: string;

  @Column({ type: 'jsonb', nullable: true })
  commentRaw: any;

  @ManyToOne(type => UserEntity)
  @JoinTable()
  author: UserEntity;

  @Index()
  @ManyToOne(type => PostEntity, post => post.replies)
  post: PostEntity;

  @OneToMany(type => CommentEntity, comment => comment.reply, { cascade: true })
  comments: CommentEntity[];

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  upvotes: UserEntity[];

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  downvotes: UserEntity[];
}
