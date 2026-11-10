import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { gallery, type GalleryItem } from "@/content/gallery";

// The database types shipped by Lovable predate the admin migration.
export const editorDb = supabase as unknown as SupabaseClient;
export const photoBucket = "site-photos";

export type SiteSettings = {
  id: number;
  theme: "classic" | "rose" | "sage";
  hero_path: string | null;
  portrait_path: string | null;
  hidden_gallery_ids: string[];
};
export type UploadedPhoto = {
  id: string;
  path: string;
  alt: string;
  service_id: string;
  authorized: boolean;
};

export function photoUrl(path: string | null | undefined) {
  return path ? editorDb.storage.from(photoBucket).getPublicUrl(path).data.publicUrl : null;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    enabled: typeof window !== "undefined",
    queryFn: async () => {
      const { data, error } = await editorDb.from("site_settings").select("*").eq("id", 1).single();
      if (error) throw error;
      return data as SiteSettings;
    },
  });
}

export function useSiteGallery() {
  return useQuery({
    queryKey: ["site-gallery"],
    enabled: typeof window !== "undefined",
    queryFn: async () => {
      const { data, error } = await editorDb.from("site_gallery").select("*").order("created_at");
      if (error) throw error;
      return data as UploadedPhoto[];
    },
  });
}

export function visibleGallery(settings?: SiteSettings, uploads: UploadedPhoto[] = []): GalleryItem[] {
  return [
    ...gallery.filter((photo) => !settings?.hidden_gallery_ids.includes(photo.id)),
    ...uploads.filter((photo) => photo.authorized).map((photo) => ({
      id: photo.id,
      serviceId: photo.service_id,
      authorized: true as const,
      after: { src: photoUrl(photo.path)!, width: 3, height: 4, alt: photo.alt },
    })),
  ];
}
