import { db } from "@/lib/firebase";
import type { Setting } from "@/types/setting";
import type { User } from "@/types/user";
import dayjs from "dayjs";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  Timestamp,
  where,
} from "firebase/firestore/lite";

const convertExpiredAt = (data: any): User => {
  if (Object.keys(data).includes("expiredAt")) {
    return {
      ...data,
      expiredAt: (data.expiredAt as Timestamp).toDate(),
    } as User;
  }
  return data;
};

export const getUser = async (id: User["id"]): Promise<User> => {
  const ref = doc(db, "Users", id);
  const userDoc = await getDoc(ref);
  return convertExpiredAt(userDoc.data()) as User;
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
      partnerId: "",
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
    t.update(settingRef, { userKeys: replaceUserKeys });

    if (!user.active) {
      //一但使用者不啟用，使用者文件和他的排班文件標記上過期日期(1年)
      const expiredAt = dayjs().add(1, "year").toDate();
      t.update(userRef, { ...user, expiredAt });
      //當使用者關閉或重啟時，會自動觸發參與排班
      t.update(scheduleRef, { expiredAt, canSchedule: user.active });
    } else {
      //一但使用者再次啟用，使用者文件和他的排班文件移除過期日期
      t.update(userRef, { ...user, expiredAt: deleteField() });
      t.update(scheduleRef, { canSchedule: user.active, expiredAt: deleteField() });
    }
  });
};

export const deleteUser = async (userId: User["id"]): Promise<void> => {
  await runTransaction(db, async (t) => {
    const userRef = doc(db, "Users", userId);
    const settingRef = doc(db, "Settings", "settings");

    const settingSnap = await t.get(settingRef);
    if (!settingSnap.exists()) {
      throw new Error("Settings not found");
    }

    const setting = settingSnap.data() as Setting;
    const userKeys = setting.userKeys.filter((u) => u.id !== userId);
    const q = query(collection(db, "Shifts"), where("attendees", "array-contains", userId));
    const shiftsSnap = await getDocs(q);
    //移除目前使用者參與的所有班次
    shiftsSnap.docs.forEach((d) => t.update(d.ref, { attendees: arrayRemove(userId) }));
    t.delete(userRef);
    t.update(settingRef, { userKeys });
  });
};
