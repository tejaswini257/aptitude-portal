import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('Email already exists');

    // Validate organization for non-super admin roles
    if (dto.role !== UserRole.SUPER_ADMIN) {
      if (!dto.orgId) {
        throw new BadRequestException(
          'Organization ID is required for this role',
        );
      }

      const org = await this.prisma.organization.findUnique({
        where: { id: dto.orgId },
      });

      if (!org) {
        throw new BadRequestException('Invalid organization ID');
      }
    }

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password,
        role: dto.role,
        orgId: dto.role === UserRole.SUPER_ADMIN ? null : dto.orgId,
      },
    });

    return { userId: user.id };
  }

  async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });
  if (!user) throw new UnauthorizedException();

  const valid = await bcrypt.compare(dto.password, user.password);
  if (!valid) throw new UnauthorizedException();

  // 🔥 role-aware payload
  const payload: any = {
    userId: user.id,
    role: user.role,
  };

  if (user.role === UserRole.COMPANY_ADMIN) {
    payload.orgId = user.orgId;
  }

  if (user.role === UserRole.COLLEGE_ADMIN) {
    payload.orgId = user.orgId ?? undefined;
    const college = await this.prisma.college.findFirst({
      where: { orgId: user.orgId ?? undefined },
      select: { id: true },
    });
    if (college) payload.collegeId = college.id;
  }

  return {
    accessToken: await this.jwtService.signAsync(payload),
  };
}

}
