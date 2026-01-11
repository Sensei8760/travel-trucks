// app/catalog/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { readFile } from 'fs/promises';
import path from 'path';

import api from '@/services/api';
import type { Camper } from '@/types/camper';
import { formatPrice } from '@/utils/formatPrice';

import CamperTabs from '@/components/CamperTabs/CamperTabs';
import BookingForm from '@/components/BookingForm/BookingForm';

import styles from './page.module.css';

type CamperRecord = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeItems(data: unknown): CamperRecord[] {
  if (Array.isArray(data)) return data.filter(isRecord) as CamperRecord[];
  if (isRecord(data) && Array.isArray(data.items)) {
    return data.items.filter(isRecord) as CamperRecord[];
  }
  return [];
}

async function readFallback(): Promise<unknown> {
  const filePath = path.join(process.cwd(), 'data', 'campersFallback.json');
  const raw = await readFile(filePath, 'utf-8');
  return JSON.parse(raw) as unknown;
}

async function getCamperById(id: string): Promise<Camper | null> {
  // 1) пробуємо бекенд /campers/:id
  try {
    const { data } = await api.get(`/campers/${id}`);
    if (isRecord(data)) return data as unknown as Camper;
  } catch {
    // ignore -> fallback
  }

  // 2) fallback: локальний json
  const fallbackRaw = await readFallback();
  const items = normalizeItems(fallbackRaw);
  const found = items.find((c) => c.id === id);

  return found ? (found as unknown as Camper) : null;
}

function prettifyLocation(location: string) {
  // "Ukraine, Kyiv" -> "Kyiv, Ukraine"
  const parts = location
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length === 2) return `${parts[1]}, ${parts[0]}`;
  return location;
}

function getGalleryUrls(camper: Camper): string[] {
  const gallery = camper.gallery ?? [];

  return gallery
    .map((item) => {
      if (typeof item === 'string') return item.trim();

      const original =
        typeof item.original === 'string' ? item.original.trim() : '';
      const thumb = typeof item.thumb === 'string' ? item.thumb.trim() : '';

      return original || thumb;
    })
    .filter((u): u is string => Boolean(u));
}

export default async function CamperDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const camper = await getCamperById(id);
  if (!camper) notFound();

  const reviewsCount = camper.reviews?.length ?? 0;
  const locationPretty = prettifyLocation(camper.location);
  const galleryUrls = getGalleryUrls(camper).slice(0, 4);

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{camper.name}</h1>

        <div className={styles.metaRow}>
          <div className={styles.ratingWrap}>
            <svg className={styles.star} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-Property-1Default-1" />
            </svg>

            <span className={styles.rating}>{camper.rating.toFixed(1)}</span>
            <span className={styles.reviews}>({reviewsCount} Reviews)</span>
          </div>

          <div className={styles.locationWrap}>
            <svg className={styles.map} aria-hidden="true">
              <use href="/icons/sprite.svg#icon-Map" />
            </svg>
            <span className={styles.location}>{locationPretty}</span>
          </div>
        </div>

        <p className={styles.price}>€{formatPrice(camper.price)}</p>

        <div className={styles.gallery}>
          {galleryUrls.map((src, idx) => (
            <div key={`${src}-${idx}`} className={styles.galleryItem}>
              <Image
                src={src}
                alt={`${camper.name} photo ${idx + 1}`}
                fill
                className={styles.galleryImg}
                sizes="(max-width: 1440px) 25vw, 300px"
                unoptimized
                priority={idx === 0}
              />
            </div>
          ))}
        </div>

        <p className={styles.description}>{camper.description}</p>

        {/* ✅ Tabs + дві колонки (ліва контент, права booking) */}
        <CamperTabs camper={camper} aside={<BookingForm />} />
      </div>
    </section>
  );
}
