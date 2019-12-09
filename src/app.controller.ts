import {
  Controller,
  Get,
  UseGuards,
  Post,
  Request,
  Response,
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
  async login(@Request() req, @Response() res) {
    const user = await this.authService.login(req.user);
    res.cookie('token', user.access_token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      secure: false,
      httpOnly: true,
      sameSite: true,
    });
    res.status(200);
    res.send(user);
  }

  /**
   * Register user and respond with the acessToken
   * @param data
   */
  @Post('auth/register')
  async register(@Body() data: UserRegisterDTO, @Response() res) {
    const userData = await this.userService.register(data);
    const user = await this.authService.login(userData);
    res.cookie('token', user.access_token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      secure: false,
      httpOnly: true,
      sameSite: true,
    });
    res.status(200);
    res.send(user);
  }
}
