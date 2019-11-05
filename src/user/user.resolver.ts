import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { ReplyService } from '../reply/reply.service';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserRegisterDTO } from './dto/user-register.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly replyService: ReplyService,
  ) {}

  @Query('users')
  async users(@Args('page') page: number) {
    return await this.userService.showAll(page);
  }

  @Query()
  async user(@Args('email') email: string) {
    return await this.userService.read(email);
  }

  @Query()
  @UseGuards(new AuthGuard())
  async whoami(@Context('user') user) {
    const { email } = user;
    return await this.userService.read(email);
  }

  @Mutation()
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user: UserLoginDTO = { email, password };
    return await this.userService.login(user);
  }

  @Mutation()
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('username') username: string,
  ) {
    const user: UserRegisterDTO = { email, password, username };
    return await this.userService.register(user);
  }

  @ResolveProperty()
  async replies(@Parent() user) {
    const { id } = user;
    return await this.replyService.showByUser(id);
  }
}
