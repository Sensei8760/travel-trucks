import { NextResponse } from 'next/server';
import axios from 'axios';
import api from '@/services/api';
import { readFile } from 'fs/promises';
import path from 'path';

async function readFallback() {
  const filePath = path.join(process.cwd(), 'data', 'campersFallback.json');
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());

  try {
    const { data } = await api.get('/campers', { params });
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status ?? 500 : 500;

    // fallback якщо upstream blocked/429
    const fallback = await readFallback();
    return NextResponse.json(fallback, {
      status: 200,
      headers: {
        'X-Fallback': '1',
        'X-Upstream-Status': String(status),
      },
    });
  }
}
