// src/utils/data.ts
export interface VideoData {
  id: string;
  title: string;
  description?: string;
  category: string;
  thumbnail: string;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  datePublished?: string;
  dateModified?: string;
  embedUrl: string;
  tags: string;
  previewUrl?: string;
  duration?: string;
}

const GOOGLE_SHEETS_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3h4dCS_WgTyWXOf7ctNScFMzP8kEhgkQ7FdIgVsxBdxywXzdexKGZKbeGnwQPMe5L6lsq72LteXQH/pub?gid=0&single=true&output=tsv';

export async function getAllVideos(): Promise<VideoData[]> {
  try {
    console.log('[getAllVideos] Mengambil data video dari Google Sheets...');
    const response = await fetch(GOOGLE_SHEETS_URL);

    if (!response.ok) {
      throw new Error(`Gagal mengambil data: ${response.statusText}`);
    }

    const tsvData = await response.text();
    const videos: VideoData[] = parseTsv(tsvData);

    console.log(`[getAllVideos] Data video dimuat. Total video: ${videos.length}`);
    return videos;
  } catch (error) {
    console.error('[getAllVideos] Error saat memuat data video:', error);
    return [];
  }
}

function parseTsv(tsv: string): VideoData[] {
  const lines = tsv.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) {
    return [];
  }

  const headers = lines[0].split('\t').map(header => header.trim());

  const dataLines = lines.slice(1);

  return dataLines.map(line => {
    const values = line.split('\t').map(value => value.trim());
    const video: Partial<VideoData> = {};

    headers.forEach((header, index) => {
      const key = header.charAt(0).toLowerCase() + header.slice(1);

      if (key === 'thumbnailWidth' || key === 'thumbnailHeight') {
        video[key as keyof VideoData] = parseInt(values[index], 10);
      } else {
        video[key as keyof VideoData] = values[index];
      }
    });
    return video as VideoData;
  });
}