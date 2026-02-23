import api from "@/interceptors/axios";

export interface CreateStudentPayload {
  email: string;
  password: string;
  rollNo: string;
  year: number;
  collegeId: string;
  departmentId: string;
}

export interface UpdateStudentPayload {
  rollNo?: string;
  year?: number;
  departmentId?: string;
}

// ✅ Backend controller = @Controller('students')

export const getStudents = (params?: { departmentId?: string; collegeId?: string }) => {
  const search = new URLSearchParams();
  if (params?.departmentId) search.set("departmentId", params.departmentId);
  if (params?.collegeId) search.set("collegeId", params.collegeId);
  const q = search.toString();
  return api.get(q ? `/students?${q}` : "/students");
};

export const getStudent = (id: string) => api.get(`/students/${id}`);

export const createStudent = (data: CreateStudentPayload) =>
  api.post("/students", data);

export const updateStudent = (id: string, data: UpdateStudentPayload) =>
  api.put(`/students/${id}`, data);

export const deleteStudent = (id: string) => api.delete(`/students/${id}`);


