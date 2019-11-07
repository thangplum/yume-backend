import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => CategoryEntity, category => category.children)
  parent: CategoryEntity;

  @OneToMany(type => CategoryEntity, category => category.parent)
  children: CategoryEntity[];

  @Column('text')
  name: string;
}
