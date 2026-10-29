/* Enquiry photos are shrunk in the browser before upload: re-encoding through a canvas
   resizes them, converts them to JPEG and drops EXIF data such as GPS location.
   Limits keep four photos plus the text well under Vercel's 4.5 MB request limit. */

export const MAX_PHOTOS = 4;
/** Longest edge in pixels after resizing. */
const MAX_EDGE = 1600;
/** Target size per photo; the server rejects anything over PHOTO_MAX_BYTES. */
const TARGET_BYTES = 600_000;
export const PHOTO_MAX_BYTES = 900_000;

export interface Photo {
  id: string;
  url: string;
  /** Base64 JPEG without the data: prefix, as Resend expects. */
  content: string;
  bytes: number;
}

const toBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));

const toBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

/** Throws when the browser cannot read the image (for example HEIC outside Safari). */
export async function shrinkPhoto(file: File): Promise<Photo> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('canvas_unavailable');
  context.fillStyle = '#fff'; // transparent PNG areas become white, not black
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  let blob: Blob | null = null;
  for (const quality of [0.82, 0.72, 0.62, 0.5]) {
    blob = await toBlob(canvas, quality);
    if (blob && blob.size <= TARGET_BYTES) break;
  }
  if (!blob || blob.size > PHOTO_MAX_BYTES) throw new Error('photo_too_large');
  return { id: crypto.randomUUID(), url: URL.createObjectURL(blob), content: await toBase64(blob), bytes: blob.size };
}
