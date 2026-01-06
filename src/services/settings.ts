import { db } from "@/lib/firebase";
import type { Setting } from "@/types/settings";
import { doc, getDoc } from "firebase/firestore/lite";

export const getSetting = async () => {
  const settingDoc = doc(db, "Settings", "settings");
  const setting = await getDoc(settingDoc);
  return setting.data() as Setting;
};
