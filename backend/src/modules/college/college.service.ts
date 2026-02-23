import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { OrgType } from '@prisma/client';

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

  /** Dashboard stats for college admin (by orgId from JWT) */
  async getDashboardStats(orgId: string) {
    const college = await this.prisma.college.findFirst({
      where: { orgId },
    });
    if (!college) {
      return {
        students: 0,
        departments: 0,
        companies: 0,
        ongoingDrives: 0,
      };
    }
    const [students, departments, companies, ongoingDrives] = await Promise.all([
      this.prisma.student.count({ where: { collegeId: college.id } }),
      this.prisma.department.count({ where: { collegeId: college.id } }),
      this.prisma.organization.count({
        where: { type: OrgType.COMPANY },
      }),
      (async () => {
        const openDriveIds = (
          await this.prisma.drive.findMany({
            where: { isOpenDrive: true },
            select: { id: true },
          })
        ).map((d) => d.id);
        if (openDriveIds.length === 0) return 0;
        return this.prisma.driveCollege.count({
          where: {
            collegeId: college.id,
            driveId: { in: openDriveIds },
          },
        });
      })(),
    ]);
    return {
      students,
      departments,
      companies,
      ongoingDrives,
    };
  }
}
