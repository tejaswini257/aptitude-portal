import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { OrgType, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE COMPANY + ADMIN
  async create(dto: CreateCompanyDto) {
    const hashedPassword = await bcrypt.hash(dto.adminPassword, 10);

    return this.prisma.organization.create({
      data: {
        name: dto.name,
        type: OrgType.COMPANY,
        users: {
          create: {
            email: dto.adminEmail,
            password: hashedPassword,
            role: UserRole.COMPANY_ADMIN,
          },
        },
      },
    });
  }

  // ✅ GET ALL COMPANIES
  findAll() {
    return this.prisma.organization.findMany({
      where: { type: OrgType.COMPANY },
      include: {
        users: {
          select: { id: true, email: true, role: true },
        },
      },
    });
  }

  // ✅ GET COMPANY BY ID
  async findOne(id: string) {
    const company = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });

    if (!company || company.type !== OrgType.COMPANY) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  // ✅ UPDATE COMPANY
  async update(id: string, dto: UpdateCompanyDto) {
    return this.prisma.organization.update({
      where: { id },
      data: dto,
    });
  }
}
