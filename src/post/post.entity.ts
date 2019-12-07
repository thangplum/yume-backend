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
  Index,
  BeforeInsert,
} from 'typeorm';
import slugify from 'slugify';
import * as nanoid from 'nanoid';

import { UserEntity } from '../user/user.entity';
import { ReplyEntity } from '../reply/reply.entity';
import { CategoryEntity } from '../category/category.entity';

@Entity('post')
export class PostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  caption: string;

  @Column('text')
  comment: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @ManyToOne(type => CategoryEntity)
  @JoinTable()
  category: CategoryEntity;

  @ManyToOne(type => UserEntity, author => author.posts)
  author: UserEntity;

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  likes: UserEntity[];

  @OneToMany(type => ReplyEntity, reply => reply.post, { cascade: true })
  replies: ReplyEntity[];

  @BeforeInsert()
  async generateSlug() {
    const slugifiedTitle = slugify(this.caption.trim());
    const randomId = nanoid(10);
    this.slug = slugifiedTitle.slice(0, 40) + '-' + randomId;
  }
}
