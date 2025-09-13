import { supabase } from "../lib/supabase";

function randomId(length = 16) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  const array = new Uint8Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      out += chars[array[i] % chars.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return out;
}

export async function uploadImagesToStorage(files: File[], options?: { bucket?: string; pathPrefix?: string }): Promise<string[]> {
  const bucket = options?.bucket ?? "post-images";
  const pathPrefix = options?.pathPrefix ?? `public/${Date.now()}`;
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() || "jpg";
    const name = `${randomId(12)}.${ext}`;
    const filePath = `${pathPrefix}/${name}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: false, contentType: file.type || "image/jpeg" });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    if (data?.publicUrl) {
      urls.push(data.publicUrl);
    }
  }

  return urls;
}
