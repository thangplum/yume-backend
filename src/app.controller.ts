import {
  Controller,
  Get,
  UseGuards,
  Post,
  Request,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { UserRegisterDTO } from './user/dto/user-register.dto';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  /**
   * Register user and respond with the acessToken
   * @param data
   */
  @Post('auth/register')
  async register(@Body() data: UserRegisterDTO) {
    const user = await this.userService.register(data);
    return this.authService.login(user);
  }
}
