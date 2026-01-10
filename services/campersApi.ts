import type { Camper } from '@/types/camper';

export interface FetchCampersParams {
  page?: number;
  limit?: number;
  location?: string;
  form?: string;
  AC?: boolean;
  kitchen?: boolean;
  TV?: boolean;
  bathroom?: boolean;
}

const buildQuery = (params: FetchCampersParams) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined) return;
    if (typeof v === 'string' && v.trim() === '') return;
    if (typeof v === 'boolean' && v === false) return;
    query.set(k, String(v));
  });

  return query.toString();
};

export const fetchCampers = async (params: FetchCampersParams): Promise<Camper[]> => {
  const qs = buildQuery(params);

  const res = await fetch(`/api/campers?${qs}`);
  if (!res.ok) throw new Error(`Failed to fetch campers (status ${res.status})`);

  const data = await res.json();

  // ✅ підтримка обох форматів
  if (Array.isArray(data)) return data;
  return data.items ?? [];
};
