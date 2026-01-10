import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('organizations')
export class OrganizationController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAll() {
    return this.prisma.organization.findMany();
  }
}