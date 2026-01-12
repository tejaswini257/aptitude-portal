import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollegeService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.college.findMany();
  }
}