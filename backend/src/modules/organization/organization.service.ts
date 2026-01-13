import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Injectable } from '@nestjs/common'

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
  return this.prisma.organization.create({
    data: dto,
  });
}

  findAll() {
    return this.prisma.organization.findMany();
  }
  

}



