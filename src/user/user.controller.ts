import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDTO } from './dto/user-register.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { AuthGuard } from '../shared/auth.guard';
import { User } from './user.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  showAllUsers() {
    return this.userService.showAll();
  }

  @Post('login')
  login(@Body() data: UserLoginDTO) {
    return this.userService.login(data);
  }

  @Post('register')
  register(@Body() data: UserRegisterDTO) {
    return this.userService.register(data);
  }
}
