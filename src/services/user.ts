import { db } from "@/lib/firebase";
import type { Setting } from "@/types/setting";
import type { User, UserKey } from "@/types/user";
import dayjs from "dayjs";
import { arrayUnion, collection, doc, getDoc, getDocs, runTransaction, Timestamp } from "firebase/firestore/lite";

const convertExpiredAt = (data: any): User => {
  if (Object.keys(data).includes("expiredAt")) {
    return {
      ...data,
      expiredAt: (data.expiredAt as Timestamp).toDate(),
    } as User;
  }
  return data;
};

export const getUserKeys = async (): Promise<UserKey[]> => {
  const ref = doc(db, "Settings", "settings");
  const settingDoc = await getDoc(ref);
  const setting = settingDoc.data() as Setting;
  return setting.userKeys;
};

export const getUser = async (id: User["id"]): Promise<User> => {
  const ref = doc(db, "Users", id);
  const userDoc = await getDoc(ref);
  return convertExpiredAt(userDoc.data()) as User;
};

export const getUsers = async (): Promise<User[]> => {
  const ref = collection(db, "Users");
  const userDocs = await getDocs(ref);
  return userDocs.docs.map((d) => convertExpiredAt(d.data())) as User[];
};

export const createUser = async (user: User) => {
  await runTransaction(db, async (t) => {
    const userRef = doc(db, "Users", user.id);
    const scheduleRef = doc(db, "Users", user.id, "Schedule", "config");
    const settingRef = doc(db, "Settings", "settings");
    const settingSnap = await t.get(settingRef);
    if (!settingSnap.exists()) {
      throw new Error("SETTINGS_NOT_FOUND");
    }
    const userKey = {
      id: user.id,
      displayName: user.displayName,
      active: user.active,
    };
    const schedule = {
      userId: user.id,
      canSchedule: true,
      siteShiftLimits: {},
      unavailableDates: [],
      partnerId: [],
    };
    t.set(userRef, user); //建立使用者
    t.set(scheduleRef, schedule); //建立使用者預設的排班
    t.update(settingRef, { userKeys: arrayUnion(userKey) });
  });
};

export const updateUser = async (user: User) => {
  await runTransaction(db, async (t) => {
    const userRef = doc(db, "Users", user.id);
    const scheduleRef = doc(db, "Users", user.id, "Schedule", "config");
    const settingRef = doc(db, "Settings", "settings");
    const settingSnap = await t.get(settingRef);
    if (!settingSnap.exists()) {
      throw new Error("SETTINGS_NOT_FOUND");
    }
    const setting = settingSnap.data() as Setting;
    const newUserKey = {
      id: user.id,
      displayName: user.displayName,
      active: user.active,
    };
    const replaceUserKeys = setting.userKeys.map((userKey) => (userKey.id === user.id ? newUserKey : userKey));
    if (!user.active) {
      user.expiredAt = dayjs().add(1, "year").toDate();
      t.update(userRef, user);
    } else {
      const { expiredAt, ...rest } = user;
      t.update(userRef, rest);
    }
    t.update(scheduleRef, { canSchedule: user.active }); //當使用者關閉或重啟時，會自動觸發參與排班
    t.update(settingRef, {
      userKeys: replaceUserKeys,
    });
  });
};
