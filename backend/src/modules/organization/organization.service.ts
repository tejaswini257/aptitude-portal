import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrganizationDto } from './dto/update-organization.dto';


@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany();
  }

  async findById(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: {
        name: dto.name,
        type: dto.type,   // ✅ now typed as OrgType
      },
    });
  }

   async update(id: string, dto: UpdateOrganizationDto) {
    await this.findById(id);

    return this.prisma.organization.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findById(id);

    return this.prisma.organization.delete({
      where: { id },
    });
  }
}

  



