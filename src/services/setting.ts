import { db } from "@/lib/firebase";
import type { Setting } from "@/types/setting";
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";

export const getSetting = async () => {
  const settingDoc = doc(db, "Settings", "settings");
  const setting = await getDoc(settingDoc);
  return setting.data() as Setting;
};

export const updateSetting = async (setting: Setting) => {
  const settingDoc = doc(db, "Settings", "settings");
  await updateDoc(settingDoc, setting);
};
