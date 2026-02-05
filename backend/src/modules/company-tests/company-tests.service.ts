import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateCompanyTestDto {
  name: string;
  rulesId?: string | null;
  showResultImmediately?: boolean;
  proctoringEnabled?: boolean;
}

@Injectable()
export class CompanyTestsService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE TEST
  async create(dto: CreateCompanyTestDto, orgId: string) {
    const data: any = {
      name: dto.name,
      organizationId: orgId,
      showResultImmediately: dto.showResultImmediately,
      proctoringEnabled: dto.proctoringEnabled,
      ...(dto.rulesId ? { rules: { connect: { id: dto.rulesId } } } : {}),
    };
    return this.prisma.test.create({ data });
  }

  // ✅ LIST TESTS
  async findAll(orgId: string) {
    return this.prisma.test.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      include: { rules: true } as any,
    });
  }

  // ✅ GET SINGLE TEST
  async findOne(id: string, orgId: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: { rules: true, sections: true } as any,
    });

    if (!test) throw new NotFoundException('Test not found');
    if (test.organizationId !== orgId)
      throw new ForbiddenException('Access denied');

    return test;
  }

  // ✅ UPDATE TEST
    async update(id: string, dto: Partial<CreateCompanyTestDto>, orgId: string) {
      const test = await this.prisma.test.findUnique({ where: { id } });
  
      if (!test) throw new NotFoundException('Test not found');
      if (test.organizationId !== orgId)
        throw new ForbiddenException('Access denied');
  
      const data: any = {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.showResultImmediately !== undefined && { showResultImmediately: dto.showResultImmediately }),
        ...(dto.proctoringEnabled !== undefined && { proctoringEnabled: dto.proctoringEnabled }),
        ...(dto.rulesId !== undefined
          ? dto.rulesId
            ? { rules: { connect: { id: dto.rulesId } } }
            : { rules: { disconnect: true } }
          : {}),
      };
  
      return this.prisma.test.update({
        where: { id },
        data,
      });
    }

  // ✅ ARCHIVE TEST (Soft)
  async archive(id: string, orgId: string) {
    const test = await this.prisma.test.findUnique({ where: { id } });

    if (!test) throw new NotFoundException('Test not found');
    if (test.organizationId !== orgId)
      throw new ForbiddenException('Access denied');

    return this.prisma.test.update({
      where: { id },
      data: {
        showResultImmediately: false,
        proctoringEnabled: false,
      },
    });
  }
}
