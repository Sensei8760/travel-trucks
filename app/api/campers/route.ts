// app/api/campers/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import api from '@/services/api';

type CamperRecord = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeItems(data: unknown): CamperRecord[] {
  if (Array.isArray(data)) return data.filter(isRecord) as CamperRecord[];

  if (isRecord(data) && Array.isArray(data.items)) {
    return (data.items as unknown[]).filter(isRecord) as CamperRecord[];
  }

  return [];
}

function parseBool(v: string | null): boolean {
  return v === 'true';
}

function getString(obj: CamperRecord, key: string): string {
  const v = obj[key];
  return typeof v === 'string' ? v : '';
}

function getBool(obj: CamperRecord, key: string): boolean {
  return obj[key] === true;
}

function applyFilters(items: CamperRecord[], searchParams: URLSearchParams): CamperRecord[] {
  const location = (searchParams.get('location') ?? '').trim().toLowerCase();
  const form = (searchParams.get('form') ?? '').trim(); // alcove|panelTruck|fullyIntegrated
  const transmission = (searchParams.get('transmission') ?? '').trim(); // automatic|manual
  const engine = (searchParams.get('engine') ?? '').trim(); // diesel|petrol|hybrid

  const boolKeys = [
    'AC',
    'bathroom',
    'kitchen',
    'TV',
    'radio',
    'refrigerator',
    'microwave',
    'gas',
    'water',
  ] as const;

  return items.filter((c) => {
    if (location) {
      const loc = getString(c, 'location').toLowerCase();
      if (!loc.includes(location)) return false;
    }

    if (form && getString(c, 'form') !== form) return false;
    if (transmission && getString(c, 'transmission') !== transmission) return false;
    if (engine && getString(c, 'engine') !== engine) return false;

    for (const key of boolKeys) {
      const need = parseBool(searchParams.get(key));
      if (need && !getBool(c, key)) return false;
    }

    return true;
  });
}

function applyPagination(items: CamperRecord[], page: number, limit: number): CamperRecord[] {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 4;

  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;

  return items.slice(start, end);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.max(1, Number(searchParams.get('limit') ?? 4));

  const filterParams = new URLSearchParams(searchParams);
  filterParams.delete('page');
  filterParams.delete('limit');

  try {
    const { data } = await api.get('/campers', { params: { page: 1, limit: 1000 } });

    const allItems = normalizeItems(data);
    const filtered = applyFilters(allItems, filterParams);
    const paged = applyPagination(filtered, page, limit);

    return NextResponse.json({ total: filtered.length, items: paged }, { status: 200 });
  } catch (err: unknown) {
    const status = axios.isAxiosError(err) ? err.response?.status ?? 500 : 500;

    // Щоб фронт не падав — віддаємо пустий список, але з хедерами для дебагу
    return NextResponse.json(
      { total: 0, items: [] },
      {
        status: 200,
        headers: {
          'X-Upstream-Status': String(status),
          'X-Fallback': '0',
        },
      }
    );
  }
}
