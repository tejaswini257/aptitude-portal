import api from "@/interceptors/axios";

export interface College {
  id: string;
  collegeName: string;
}

export const getColleges = () => {
  return api.get("/colleges");
};