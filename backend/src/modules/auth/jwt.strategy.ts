import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
<<<<<<< HEAD:backend/src/auth/jwt.strategy.ts
      secretOrKey: process.env.JWT_SECRET,
=======
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
>>>>>>> ccc50dd65c65df8ff30d736b8382cf9ed7bb1034:backend/src/modules/auth/jwt.strategy.ts
    });
  }

  async validate(payload: any) {
<<<<<<< HEAD:backend/src/auth/jwt.strategy.ts
    return payload; // attaches to request.user
=======
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
>>>>>>> ccc50dd65c65df8ff30d736b8382cf9ed7bb1034:backend/src/modules/auth/jwt.strategy.ts
  }
}
