import { NextResponse } from 'next/server';
import axios from 'axios';
import api from '@/services/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Гарантуємо дефолти пагінації, якщо з фронта не прийшли.
  // MockAPI використовує page (starts at 1) та limit.
  const params: Record<string, string> = Object.fromEntries(searchParams.entries());
  if (!params.page) params.page = '1';
  if (!params.limit) params.limit = '4';

  try {
    // Усі фільтри (location/form/transmission/AC...) та пагінація
    // виконуються на mockapi.io.
    const { data } = await api.get('/campers', { params });

    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const status = axios.isAxiosError(err) ? err.response?.status ?? 500 : 500;

    // Щоб фронт не падав — віддаємо пустий список
    return NextResponse.json([], {
      status: 200,
      headers: {
        'X-Upstream-Status': String(status),
        'X-Fallback': '0',
      },
    });
  }
}