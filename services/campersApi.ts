import axios from 'axios';
import type { Camper } from '@/types/camper';

export type CamperForm = 'alcove' | 'panelTruck' | 'fullyIntegrated';
export type CamperTransmission = 'automatic' | 'manual';
export type CamperEngine = 'diesel' | 'petrol' | 'hybrid';

export interface FetchCampersParams {
  page?: number;
  limit?: number;

  location?: string;
  form?: CamperForm;
  transmission?: CamperTransmission;
  engine?: CamperEngine;

  AC?: boolean;
  bathroom?: boolean;
  kitchen?: boolean;
  TV?: boolean;
  radio?: boolean;
  refrigerator?: boolean;
  microwave?: boolean;
  gas?: boolean;
  water?: boolean;
}

function sanitizeParams(params: FetchCampersParams) {
  const clean: Record<string, string | number | boolean> = {};

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;

    if (typeof v === 'string') {
      const trimmed = v.trim();
      if (!trimmed) return;
      clean[k] = trimmed;
      return;
    }

    if (typeof v === 'boolean') {
      if (!v) return; 
      clean[k] = true;
      return;
    }

    clean[k] = v;
  });

  return clean;
}

export const fetchCampers = async (params: FetchCampersParams): Promise<Camper[]> => {
  const clean = sanitizeParams(params);

  const { data } = await axios.get('/api/campers', { params: clean });

  if (Array.isArray(data)) return data;
  return data.items ?? [];
};
