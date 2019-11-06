import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDTO } from './dto/user-register.dto';
import { UserLoginDTO } from './dto/user-login.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  showAllUsers(@Query('page') page: number) {
    return this.userService.showAll(page);
  }

  @Post('register')
  register(@Body() data: UserRegisterDTO) {
    return this.userService.register(data);
  }
}
