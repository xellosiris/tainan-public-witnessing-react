import { db } from "@/lib/firebase";
import type { Site } from "@/types/site";
import { collection, getDocs } from "firebase/firestore/lite";

export const getSites = async (): Promise<Site[]> => {
  const siteDocs = await getDocs(collection(db, "Sites"));
  return siteDocs.docs.map((d) => d.data()) as Site[];
};
