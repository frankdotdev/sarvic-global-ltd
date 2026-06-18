import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'shipment-documents';

let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
} else {
  console.warn('[Storage] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured. Document uploads will be unavailable until these are set.');
}

export function isStorageConfigured(): boolean {
  return supabase !== null;
}

/**
 * Uploads a file buffer to Supabase Storage and returns its public URL.
 * Throws if storage is not configured — callers should check
 * isStorageConfigured() first and return a clear error to the client.
 */
export async function uploadDocument(params: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  shipmentId: string;
}): Promise<{ url: string; path: string }> {
  if (!supabase) {
    throw new Error('Document storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable uploads.');
  }

  const sanitizedName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${params.shipmentId}/${Date.now()}-${sanitizedName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, params.buffer, {
      contentType: params.mimeType,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return { url: publicUrlData.publicUrl, path };
}

/**
 * Deletes a document from storage by its stored path.
 */
export async function deleteDocument(path: string): Promise<void> {
  if (!supabase) {
    throw new Error('Document storage is not configured.');
  }
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}
