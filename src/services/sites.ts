import { db } from "@/lib/firebase";
import type { Setting } from "@/types/settings";
import type { Site, SiteKey } from "@/types/site";
import { doc, getDoc } from "firebase/firestore/lite";

export const getSiteKeys = async (): Promise<SiteKey[]> => {
  const ref = doc(db, "Settings", "settings");
  const settingDoc = await getDoc(ref);
  const setting = settingDoc.data() as Setting;
  return setting["siteKeys"];
};

export const getSite = async (siteId: Site["id"]): Promise<Site> => {
  const ref = doc(db, "Sites", siteId);
  const siteDoc = await getDoc(ref);
  return siteDoc.data() as Site;
};
