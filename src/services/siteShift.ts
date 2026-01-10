import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";
import type { Site } from "@/types/site";
import type { SiteShift } from "@/types/siteShift";

export const getSiteShifts = async (): Promise<SiteShift[]> => {
  const ref = collection(db, "SiteShifts");
  const siteShiftDocs = await getDocs(ref);
  return siteShiftDocs.docs.map((d) => d.data()) as SiteShift[];
};

export const getSiteShift = async (
  siteId: Site["id"],
): Promise<SiteShift[]> => {
  const ref = query(
    collection(db, "SiteShifts"),
    where("siteId", "==", siteId),
  );
  const siteShiftDocs = await getDocs(ref);
  return siteShiftDocs.docs.map((d) => d.data()) as SiteShift[];
};
