import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserLoginDTO } from '../user/dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(data: UserLoginDTO): Promise<any> {
    const user = await this.userService.login(data);
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    /**
     * This payload is what is sent to the user.
     * So, the decoded payload from user will also only have these values
     * Payload : {email, id}
     */
    const payload = { email: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
