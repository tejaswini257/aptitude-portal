import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateStudentDto {
  email: string;
  password: string;
  rollNo: string;
  year: number;
  collegeId: string;
  departmentId: string;
}