import api from "@/interceptors/axios";
import { AxiosResponse } from "axios";

export interface CreateStudentPayload {
  name: string;
  email: string;
  departmentId: string;
}

export const getStudents = (): Promise<AxiosResponse<any[]>> =>
  api.get("/students");

export const createStudent = (
  data: CreateStudentPayload
): Promise<AxiosResponse<any>> =>
  api.post("/students", data);

export const updateStudent = (
  id: string,
  data: Partial<CreateStudentPayload>
): Promise<AxiosResponse<any>> =>
  api.patch(`/students/${id}`, data);

export const deleteStudent = (
  id: string
): Promise<AxiosResponse<void>> =>
  api.delete(`/students/${id}`);
