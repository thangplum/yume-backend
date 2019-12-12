import { ExtractJwt, Strategy, JwtFromRequestFunction } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

const cookieExtractor: JwtFromRequestFunction = req => {
  let token = null;
  if (req && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // only check for token in header in developement (less secure)
  if (
    process.env.NODE_ENV === 'development' &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor, //ExtractJwt.fromAuthHeaderAsBearerToken(),
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
