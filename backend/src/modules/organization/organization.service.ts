import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
    const existing = await this.prisma.organization.findFirst({
      where: {
        name: dto.name,
      },
    });

    if (existing) {
      throw new BadRequestException('Organization already exists');
    }

    return this.prisma.organization.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.organization.findMany();
  }
}
