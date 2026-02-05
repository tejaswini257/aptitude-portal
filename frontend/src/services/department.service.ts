import api from "@/interceptors/axios";

export interface Department {
  id: string;
  name: string;
}

// ✅ Filter departments by college
export const getDepartments = (collegeId: string) => {
  return api.get(`/departments?collegeId=${collegeId}`);
};