import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service'; // adjust path if needed

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const userFromDb = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!userFromDb) return null;

    return {
      ...userFromDb,
      role: payload.role,
      orgId: payload.orgId,
    };
  }
}
