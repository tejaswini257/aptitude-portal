import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Injectable } from '@nestjs/common'

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: {
        name: data.name,
        type: data.type,   // ✅ now typed as OrgType
      },
    });
  }

  findAll() {
    return this.prisma.organization.findMany();
  }
}



