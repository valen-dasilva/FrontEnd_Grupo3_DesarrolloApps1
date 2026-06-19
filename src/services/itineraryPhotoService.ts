const SUPABASE_URL = 'https://qwkqhlpwwpjjqcbztbcl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3a3FobHB3d3BqanFjYnp0YmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzAzMTgsImV4cCI6MjA4OTUwNjMxOH0.PVQjAPvwRvEVolQhQnG1hSmKdeywTzgYnvw6Bd-eScg';
const BUCKET_NAME = 'itinerarios-usuario-fotos';
const PUBLIC_URL_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/`;

export const MAX_ITINERARY_PHOTOS = 10;
export const MAX_ITINERARY_PHOTO_BYTES = 8 * 1024 * 1024;

export interface ItineraryPhotoFile {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
}

export interface UploadedItineraryPhoto {
  url: string;
  path: string;
}

const extensionFrom = (file: ItineraryPhotoFile): string => {
  const fileExtension = file.fileName?.match(/\.([a-zA-Z0-9]+)$/)?.[1];
  if (fileExtension) return fileExtension.toLowerCase();

  const mimeSubtype = file.mimeType?.split('/')[1]?.split('+')[0];
  if (!mimeSubtype) return 'jpg';
  return mimeSubtype === 'jpeg' ? 'jpg' : mimeSubtype.toLowerCase();
};

const encodeObjectPath = (path: string): string =>
  path.split('/').map(encodeURIComponent).join('/');

const storageHeaders = (contentType?: string): Record<string, string> => ({
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  apikey: SUPABASE_ANON_KEY,
  ...(contentType ? { 'Content-Type': contentType } : {}),
});

export async function uploadItineraryPhoto(
  userId: number,
  file: ItineraryPhotoFile,
): Promise<UploadedItineraryPhoto> {
  if (file.fileSize && file.fileSize > MAX_ITINERARY_PHOTO_BYTES) {
    throw new Error('La imagen supera el límite de 8 MB.');
  }

  let blob: Blob;
  try {
    const localResponse = await fetch(file.uri);
    blob = await localResponse.blob();
  } catch {
    throw new Error('No se pudo leer la imagen seleccionada.');
  }

  if (blob.size > MAX_ITINERARY_PHOTO_BYTES) {
    throw new Error('La imagen supera el límite de 8 MB.');
  }

  const contentType = file.mimeType || blob.type || 'image/jpeg';
  if (!contentType.startsWith('image/')) {
    throw new Error('El archivo seleccionado no es una imagen válida.');
  }

  const uniquePart = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const path = `usuarios/${userId}/${uniquePart}.${extensionFrom(file)}`;
  const encodedPath = encodeObjectPath(path);

  const uploadResponse = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${encodedPath}`,
    {
      method: 'POST',
      headers: {
        ...storageHeaders(contentType),
        'x-upsert': 'false',
      },
      body: blob,
    },
  );

  if (!uploadResponse.ok) {
    const detail = await uploadResponse.text();
    throw new Error(`No se pudo subir la imagen: ${detail}`);
  }

  return {
    path,
    url: `${PUBLIC_URL_PREFIX}${encodedPath}`,
  };
}

export function getItineraryPhotoPath(publicUrl: string): string | null {
  if (!publicUrl.startsWith(PUBLIC_URL_PREFIX)) return null;
  try {
    return decodeURIComponent(publicUrl.slice(PUBLIC_URL_PREFIX.length));
  } catch {
    return null;
  }
}

export async function deleteItineraryPhotoFromStorage(publicUrl: string): Promise<void> {
  const path = getItineraryPhotoPath(publicUrl);
  if (!path) return;

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${encodeObjectPath(path)}`,
    {
      method: 'DELETE',
      headers: storageHeaders(),
    },
  );

  if (!response.ok && response.status !== 404) {
    const detail = await response.text();
    throw new Error(`No se pudo eliminar la imagen de Storage: ${detail}`);
  }
}
