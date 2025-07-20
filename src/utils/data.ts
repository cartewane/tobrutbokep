// src/utils/data.ts
import { parse } from 'csv-parse/browser/esm/sync';

export interface VideoData {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  datePublished?: string;
  dateModified?: string;
  embedUrl: string;
  tags: string;
  previewUrl?: string;
  duration?: string;
}

const GOOGLE_SHEET_TSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3h4dCS_WgTyWXOf7ctNScFMzP8kEhgkQ7FdIgVsxBdxywXzdexKGZKbeGnwQPMe5L6lsq72LteXQH/pub?gid=0&single=true&output=tsv';

async function fetchAndParseTsv(): Promise<VideoData[]> {
  try {
    console.log('[getAllVideos] Mengambil data dari Google Sheet...');
    const response = await fetch(GOOGLE_SHEET_TSV_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch TSV data: ${response.statusText}`);
    }

    const tsvText = await response.text();

    const records = parse(tsvText, {
      columns: true,
      delimiter: '\t',
      skip_empty_lines: true,
      cast: true,
    });

    const videos: VideoData[] = records.map((record: any) => ({
      id: String(record.id),
      title: String(record.title),
      description: String(record.description),
      category: String(record.category),
      thumbnail: String(record.thumbnail),
      thumbnailWidth: Number(record.thumbnailWidth),
      thumbnailHeight: Number(record.thumbnailHeight),
      datePublished: record.datePublished ? String(record.datePublished) : undefined,
      dateModified: record.dateModified ? String(record.dateModified) : undefined,
      embedUrl: String(record.embedUrl),
      tags: String(record.tags),
      previewUrl: record.previewUrl ? String(record.previewUrl) : undefined,
      duration: record.duration ? String(record.duration) : undefined,
    }));

    console.log(`[getAllVideos] Data video dimuat dari Google Sheet. Total video: ${videos.length}`);
    return videos;
  } catch (error) {
    console.error('[getAllVideos] Gagal memuat atau memproses data dari Google Sheet:', error);
    return [];
  }
}

export async function getAllVideos(): Promise<VideoData[]> {
  return await fetchAndParseTsv();
}
