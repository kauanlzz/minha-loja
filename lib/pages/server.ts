import { getLocalContentPage } from "@/lib/catalog/content";
import type { ContentPage } from "@/lib/pages/types";

export async function getPage({ handle }: { handle: string }): Promise<ContentPage | undefined> {
  return getLocalContentPage(handle);
}
