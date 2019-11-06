import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   * After decoding the jwt token. This object is attached to the request object.
   * This object is accessed by all the controllers and resolvers which have an
   * auth guard in them
   */
  async validate(payload: any) {
    return { id: payload.id, email: payload.email };
  }
}
