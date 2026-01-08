import { db } from "@/lib/firebase";
import type { Site } from "@/types/site";
import { collection, doc, getDoc, getDocs } from "firebase/firestore/lite";

export const getSites = async (): Promise<Site[]> => {
  const ref = collection(db, "Sites");
  const settingDocs = await getDocs(ref);
  return settingDocs.docs.map((d) => d.data()) as Site[];
};

export const getSite = async (siteId: Site["id"]): Promise<Site> => {
  const ref = doc(db, "Sites", siteId);
  const siteDoc = await getDoc(ref);
  return siteDoc.data() as Site;
};
