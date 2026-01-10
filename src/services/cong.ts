import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";
import type { Congregation } from "@/types/congregation";

export const getCongs = async (): Promise<Congregation[]> => {
  const ref = collection(db, "Congregations");
  const docs = await getDocs(ref);
  return docs.docs.map((d) => d.data()) as Congregation[];
};
