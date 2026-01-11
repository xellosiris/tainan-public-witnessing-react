import { db } from "@/lib/firebase";
import type { Setting } from "@/types/setting";
import type { Site } from "@/types/site";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore/lite";

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

export const createSite = async (site: Site): Promise<void> => {
  const ref = doc(db, "Sites", site.id);
  const settingRef = doc(db, "Settings", "settings");
  const newKey = {
    id: site.id,
    active: site.active,
    name: site.name,
  };
  await updateDoc(settingRef, {
    siteKeys: arrayUnion(newKey),
  });
  await setDoc(ref, site);
};

export const updateSite = async (site: Site): Promise<void> => {
  const ref = doc(db, "Sites", site.id);
  const settingRef = doc(db, "Settings", "settings");
  const setting = (await getDoc(settingRef)).data() as Setting;
  const siteKeys = setting.siteKeys.map((key) => (key.id === site.id ? { ...site } : key));
  await updateDoc(settingRef, { siteKeys });
  await updateDoc(ref, site);
};

export const deleteSite = async (siteId: Site["id"]): Promise<void> => {
  await runTransaction(db, async (t) => {
    const siteRef = doc(db, "Sites", siteId);
    const settingRef = doc(db, "Settings", "settings");

    const settingSnap = await t.get(settingRef);
    if (!settingSnap.exists()) {
      throw new Error("Settings not found");
    }

    const setting = settingSnap.data() as Setting;
    const siteKeys = setting.siteKeys.filter((site) => site.id !== siteId);
    const q = query(collection(db, "Shifts"), where("siteId", "==", siteId));

    const shiftsSnap = await getDocs(q);

    shiftsSnap.docs.forEach((d) => t.delete(d.ref));
    t.delete(siteRef);
    t.update(settingRef, { siteKeys });
  });
};
