import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DrivesService {
  constructor(private prisma: PrismaService) {}

  // -----------------------------
  // CREATE DRIVE (already exists)
  // -----------------------------
  async createDrive(dto: any, companyId: string) {
    return this.prisma.drive.create({
      data: {
        companyId,
        testId: dto.testId,
        isOpenDrive: dto.isOpenDrive,
        startDate: dto.startDate,
        endDate: dto.endDate,
        description: dto.description,
      },
    });
  }

  // -----------------------------
  // INVITE COLLEGES TO DRIVE
  // -----------------------------
  async inviteColleges(
    driveId: string,
    collegeIds: string[],
    companyId: string,
  ) {
    // 1️⃣ Validate drive belongs to company
    const drive = await this.prisma.drive.findUnique({
      where: { id: driveId },
    });

    if (!drive) {
      throw new NotFoundException('Drive not found');
    }

    if (drive.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
    }

    // 2️⃣ Remove already-invited colleges
    const existing = await this.prisma.driveCollege.findMany({
      where: {
        driveId,
        collegeId: { in: collegeIds },
      },
      select: { collegeId: true },
    });

    const existingIds = existing.map(e => e.collegeId);

    const newCollegeIds = collegeIds.filter(
      id => !existingIds.includes(id),
    );

    if (newCollegeIds.length === 0) {
      return { message: 'Colleges already invited' };
    }

    // 3️⃣ Create invitations
    await this.prisma.driveCollege.createMany({
      data: newCollegeIds.map(collegeId => ({
        driveId,
        collegeId,
      })),
    });

    return { message: 'Colleges invited successfully' };
  }

  // -----------------------------
  // GET INVITED COLLEGES
  // -----------------------------
  async getInvitedColleges(driveId: string, companyId: string) {
    const drive = await this.prisma.drive.findUnique({
      where: { id: driveId },
    });

    if (!drive) {
      throw new NotFoundException('Drive not found');
    }

    if (drive.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.driveCollege.findMany({
      where: { driveId },
      include: {
        drive: false,
      },
    });
  }

  // -----------------------------
  // REMOVE COLLEGE FROM DRIVE
  // -----------------------------
  async removeCollege(
    driveId: string,
    collegeId: string,
    companyId: string,
  ) {
    const drive = await this.prisma.drive.findUnique({
      where: { id: driveId },
    });

    if (!drive) {
      throw new NotFoundException('Drive not found');
    }

    if (drive.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.driveCollege.deleteMany({
      where: {
        driveId,
        collegeId,
      },
    });

    return { message: 'College removed from drive' };
  }
}
