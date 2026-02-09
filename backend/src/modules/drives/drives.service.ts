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
    const { randomUUID } = await import('crypto');
    return this.prisma.drive.create({
      data: {
        id: randomUUID(),
        Organization: { connect: { id: companyId } },
        Test: { connect: { id: dto.testId } },
        isOpenDrive: dto.isOpenDrive ?? false,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        description: dto.description ?? null,
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

    const { randomUUID } = await import('crypto');
    await Promise.all(
      newCollegeIds.map((collegeId) =>
        this.prisma.driveCollege.create({
          data: {
            id: randomUUID(),
            driveId,
            collegeId,
          },
        }),
      ),
    );

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
