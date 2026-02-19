// src/modules/sections/sections.service.ts

import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateSectionDto } from "./dto/create-section.dto";

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  // ✅ Create Section
  async create(createSectionDto: CreateSectionDto, orgId: string) {

    const existing = await this.prisma.section.findFirst({
      where: {
        sectionName: createSectionDto.sectionName,
        orgId,
      },
    });

    if (existing) {
      throw new BadRequestException("Section with this name already exists");
    }

    return this.prisma.section.create({
      data: {
        sectionName: createSectionDto.sectionName,
        description: createSectionDto.description,
        type: createSectionDto.type,
        orgId,
      },
    });
  }

  // ✅ Get All Sections (for Question Bank page)
  async findAll(orgId: string) {
    return this.prisma.section.findMany({
      where: { orgId },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });
  }

  // ✅ Get Single Section (for Manage Questions page)
  async findOne(id: string, orgId: string) {
    const section = await this.prisma.section.findFirst({
      where: { id, orgId },
      include: {
        questions: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!section) {
      throw new NotFoundException("Section not found");
    }

    return section;
  }

  // ✅ Get Sections Attached To Test
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
