// src/modules/sections/sections.service.ts

import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { SectionType } from "@prisma/client";
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

    // DTO allows UNSEEN_PARAGRAPH; ensure Prisma receives valid SectionType (run `npx prisma generate` if schema was updated)
    const sectionType: SectionType = createSectionDto.type as SectionType;

    return this.prisma.section.create({
      data: {
        sectionName: createSectionDto.sectionName,
        description: createSectionDto.description,
        type: sectionType,
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
          include: {
            options: true,
            codingQuestion: true,
            passageWritingMeta: true,
            passageDropdownMeta: true,
            unseenParagraphMeta: true,
            parentQuestion: {
              include: {
                unseenParagraphMeta: true,
              },
            },
          },
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

  // ✅ Delete Section (cascade will remove questions/options; remove test section links first)
  async delete(id: string, orgId: string) {
    const section = await this.prisma.section.findFirst({
      where: { id, orgId },
    });

    if (!section) {
      throw new NotFoundException("Section not found");
    }

    await this.prisma.testSection.deleteMany({
      where: { sectionId: id },
    });

    await this.prisma.question.deleteMany({
      where: { sectionId: id },
    });

    return this.prisma.section.delete({
      where: { id },
    });
  }

  // ✅ Update Section (title, description)
  async update(
    id: string,
    orgId: string,
    data: { sectionName?: string; description?: string },
  ) {
    const section = await this.prisma.section.findFirst({
      where: { id, orgId },
    });
    if (!section) throw new NotFoundException("Section not found");

    return this.prisma.section.update({
      where: { id },
      data: {
        ...(data.sectionName != null && { sectionName: data.sectionName }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });
  }
}
