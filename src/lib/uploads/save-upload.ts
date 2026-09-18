import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/x-icon"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Guarda una imagen subida desde el panel de administración.
 *
 * En Vercel el sistema de archivos es de solo lectura (salvo /tmp, que no
 * persiste entre despliegues), por eso cuando existe BLOB_READ_WRITE_TOKEN
 * (Vercel Blob habilitado en el proyecto) subimos ahí. En desarrollo local,
 * o si no se ha conectado un Blob store, se guarda en public/uploads.
 */
export async function saveUploadedImage(file: File, prefix: string): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Formato de imagen no permitido. Usa PNG, JPG, WEBP o SVG.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("La imagen supera el tamaño máximo de 5MB.");
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop() : "png";
  const filename = `${prefix}-${crypto.randomUUID()}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blob.url;
  }

  await mkdir(UPLOADS_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return `/uploads/${filename}`;
}
