import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { PostService } from '../post/post.service';
import { CategoryDTO } from './category.dto';

@Resolver('Category')
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly postService: PostService,
  ) {}

  @Query('categories')
  async categories() {
    return await this.categoryService.showAll();
  }

  @Query('category')
  async category(@Args('slug') slug: string) {
    return await this.categoryService.show(slug);
  }

  @Query('categoryBySlug')
  async categoryBySlug(@Args('slug') slug: string) {
    return await this.categoryService.showBySlug(slug);
  }

  @Query('forumCategories')
  async forumCategories() {
    return await this.categoryService.showForumCategory();
  }

  @Mutation()
  async createCategory(
    @Args('name') name: string,
    @Args('parent') parentId: string,
  ) {
    const data: CategoryDTO = { name, parent: parentId };
    return await this.categoryService.createCategory(data);
  }

  @ResolveProperty()
  async posts(
    @Parent() category,
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('newest') newest: boolean,
  ) {
    const { id } = category;
    return await this.postService.showByCategory(id, page, limit, newest);
  }
}
