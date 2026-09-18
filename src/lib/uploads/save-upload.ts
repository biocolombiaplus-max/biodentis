import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/x-icon"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function saveUploadedImage(file: File, prefix: string): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Formato de imagen no permitido. Usa PNG, JPG, WEBP o SVG.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("La imagen supera el tamaño máximo de 5MB.");
  }

  await mkdir(UPLOADS_DIR, { recursive: true });

  const extension = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const filename = `${prefix}-${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOADS_DIR, filename), buffer);

  return `/uploads/${filename}`;
}
