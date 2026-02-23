// src/modules/sections/sections.service.ts

import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async create(sectionName: string, orgId: string) {
    return this.prisma.section.create({
      data: {
        sectionName,
        orgId,
      },
    });
  }

  async findAll(orgId: string) {
    return this.prisma.section.findMany({
      where: { orgId, isActive: true },
      orderBy: { sectionName: "asc" },
    });
  }

  async findByTest(testId: string, orgId: string) {
    if (!orgId) return [];
    return this.prisma.testSection.findMany({
      where: {
        testId,
        section: {
          orgId,
        },
      },
      include: {
        section: true,
      },
    });
  }
}