import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';

@Injectable()
export class CollegesService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE COLLEGE
async create(dto: CreateCollegeDto) {
  const org = await this.prisma.organization.findUnique({
    where: { id: dto.orgId },
  });

  if (!org) {
    throw new NotFoundException('Organization not found');
  }

  return this.prisma.college.create({
    data: {
      // scalar fields
      orgId: dto.orgId,
      collegeName: dto.collegeName,
      collegeType: dto.collegeType,
      address: dto.address,
      contactPerson: dto.contactPerson,
      contactEmail: dto.contactEmail,
      mobile: dto.mobile,
      maxStudents: dto.maxStudents,
      isApproved: false,

      // ✅ REQUIRED RELATION
      organization: {
        connect: {
          id: dto.orgId,
        },
      },
    },
  });
}

  // ✅ GET ALL COLLEGES
  findAll(user) {
  if (user.role === 'SUPER_ADMIN') {
    return this.prisma.college.findMany();   // no filter
  }

  return this.prisma.college.findMany({
    where: {
      orgId: user.orgId,
    },
  });
}

  // ✅ GET COLLEGE BY ID
  async findOne(id: string) {
    const college = await this.prisma.college.findUnique({
      where: { id },
    });

    if (!college) {
      throw new NotFoundException('College not found');
    }

    return college;
  }

  // ✅ UPDATE COLLEGE
  update(id: string, dto: UpdateCollegeDto) {
    return this.prisma.college.update({
      where: { id },
      data: dto,
    });
  }

  // ✅ APPROVE COLLEGE
  approveCollege(id: string) {
    return this.prisma.college.update({
      where: { id },
      data: { isApproved: true },
    });
  }
}
