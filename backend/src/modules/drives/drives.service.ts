import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDriveDto } from './dto/create-drive.dto';
import { UpdateDriveDto } from './dto/update-drive.dto';

@Injectable()
export class DrivesService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE DRIVE
  async create(dto: CreateDriveDto, companyId: string) {
    return this.prisma.drive.create({
      data: {
        companyId,
        testId: dto.testId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        description: dto.description,
        isOpenDrive: dto.isOpenDrive,
      },
    });
  }

  // ✅ LIST DRIVES (Company-wise)
  async findAll(companyId: string) {
    return this.prisma.drive.findMany({
      where: { companyId },
      include: {
        test: true,
        colleges: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  // ✅ GET SINGLE DRIVE
  async findOne(id: string) {
    const drive = await this.prisma.drive.findUnique({
      where: { id },
      include: {
        test: true,
        colleges: true,
      },
    });

    if (!drive) {
      throw new NotFoundException('Drive not found');
    }

    return drive;
  }

  // ✅ UPDATE DRIVE
  async update(id: string, dto: UpdateDriveDto) {
    return this.prisma.drive.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  // ✅ CLOSE / ARCHIVE DRIVE
  async close(id: string) {
    return this.prisma.drive.update({
      where: { id },
      data: {
        isOpenDrive: false,
      },
    });
  }
}
