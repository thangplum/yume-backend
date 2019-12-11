import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { Repository, Not } from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { CategoryDTO } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async showAll() {
    const categories = await this.categoryRepository.find({
      relations: ['parent', 'children'],
    });
    return categories;
  }

  async show(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['parent', 'children'],
    });
    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async showBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['parent', 'children'],
    });
    if (!category) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async showForumCategory() {
    const categories = await this.categoryRepository.find({
      where: { parent: null },
      relations: ['children'],
    });
    return categories;
  }

  async createCategory(data: CategoryDTO) {
    let parent = null;
    if (data.parent) {
      parent = await this.categoryRepository.findOne({
        where: { id: data.parent },
      });
      if (!parent) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
    }
    const category = await this.categoryRepository.create({
      name: data.name,
      parent,
    });
    await this.categoryRepository.save(category);
    return category;
  }
}
