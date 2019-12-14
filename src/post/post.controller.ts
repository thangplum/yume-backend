import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Logger,
  Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDTO } from './post.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  showAllPosts(@Query('page') page: number) {
    return this.postService.showAll(page);
  }

  @Get('/newest')
  showNewestPosts(@Query('page') page: number) {
    return this.postService.showAll(page, 25, true);
  }

  @Get('/search')
  async searchInPost(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.postService.searchInPost(query, page, limit);
  }

  @Post(':categoryId')
  @UseGuards(AuthGuard('jwt'))
  createPost(
    @User('id') userId: string,
    @Body() data: PostDTO,
    @Param('categoryId') categoryId: string,
  ) {
    return this.postService.create(userId, categoryId, data);
  }

  @Get(':id')
  showPost(@Param('id') id: string) {
    return this.postService.show(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updatePost(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() data: Partial<PostDTO>,
  ) {
    return this.postService.update(id, userId, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deletePost(@Param('id') id: string, @User('id') userId: string) {
    return this.postService.delete(id, userId);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  likePost(@Param('id') id: string, @User('id') userId: string) {
    return this.postService.like(id, userId);
  }

  @Delete(':id/like')
  @UseGuards(AuthGuard('jwt'))
  unLikePost(@Param('id') id: string, @User('id') userId: string) {
    return this.postService.like(id, userId);
  }

  @Post(':id/bookmark')
  @UseGuards(AuthGuard('jwt'))
  bookmarkPost(@Param('id') id: string, @User('id') userId: string) {
    return this.postService.bookmark(id, userId);
  }

  @Delete(':id/bookmark')
  @UseGuards(AuthGuard('jwt'))
  unBookmarkPost(@Param('id') id: string, @User('id') userId: string) {
    return this.postService.unBookmark(id, userId);
  }
}
