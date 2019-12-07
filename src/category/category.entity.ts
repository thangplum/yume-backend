import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import slugify from 'slugify';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(type => CategoryEntity, category => category.children)
  parent: CategoryEntity;

  @OneToMany(type => CategoryEntity, category => category.parent)
  children: CategoryEntity[];

  @Column('text')
  name: string;

  @BeforeInsert()
  async generateSlug() {
    this.slug = slugify(this.name);
  }
}
