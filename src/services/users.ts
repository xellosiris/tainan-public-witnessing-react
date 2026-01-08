import { db } from "@/lib/firebase";
import type { Setting } from "@/types/settings";
import type { User, UserKey } from "@/types/user";
import { collection, doc, getDoc, getDocs } from "firebase/firestore/lite";

export const getUserKeys = async (): Promise<UserKey[]> => {
  const ref = doc(db, "Settings", "settings");
  const settingDoc = await getDoc(ref);
  const setting = settingDoc.data() as Setting;
  return setting["userKeys"];
};

export const getUser = async (id: User["id"]): Promise<User> => {
  const ref = doc(db, "User", id);
  const userDoc = await getDoc(ref);
  return userDoc.data() as User;
};

export const getUsers = async (): Promise<User[]> => {
  const ref = collection(db, "User");
  const userDocs = await getDocs(ref);
  return userDocs.docs.map((d) => d.data()) as User[];
};
