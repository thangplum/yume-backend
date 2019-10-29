import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDTO } from './post.dto';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../user/user.decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  showAllPosts() {
    return this.postService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  createPost(@User('id') userId, @Body() data: PostDTO) {
    return this.postService.create(userId, data);
  }

  @Get(':id')
  showPost(@Param('id') id: string) {
    return this.postService.show(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  updatePost(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() data: Partial<PostDTO>,
  ) {
    return this.postService.update(id, userId, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  deletePost(@Param('id') id: string, @User('id') userId: string) {
    return this.postService.delete(id, userId);
  }
}
