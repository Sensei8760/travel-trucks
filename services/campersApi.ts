import api from './api';
import { Camper } from '@/types/camper';

export interface FetchCampersParams {
  page?: number;
  limit?: number;
  location?: string;
  form?: string;
  AC?: boolean;
  kitchen?: boolean;
  TV?: boolean;
  radio?: boolean;
  bathroom?: boolean;
}

export const fetchCampers = async (params: FetchCampersParams) => {
  const { data } = await api.get<Camper[]>('/campers', {
    params,
  });

  return data;
};

export const fetchCamperById = async (id: string) => {
  const { data } = await api.get<Camper>(`/campers/${id}`);
  return data;
};
