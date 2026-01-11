import { db } from "@/lib/firebase";
import type { Shift } from "@/types/shift";
import type { User } from "@/types/user";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  type Timestamp,
  where,
} from "firebase/firestore/lite";

const convertExpiredAt = (data: any): Shift => {
  return {
    ...data,
    expiredAt: (data.expiredAt as Timestamp).toDate(),
  } as Shift;
};

export const getShiftsByDate = async (date: string): Promise<Shift[]> => {
  const q = query(collection(db, "Shifts"), where("date", "==", date), orderBy("startTime", "asc"));
  const docs = await getDocs(q);
  return docs.docs.map((d) => convertExpiredAt(d.data()));
};

export const getPersonalShiftByMonth = async (id: User["id"], yearMonth: Shift["yearMonth"]): Promise<Shift[]> => {
  const q = query(
    collection(db, "Shifts"),
    where("attendees", "array-contains", id),
    where("yearMonth", "==", yearMonth),
    orderBy("startTime", "asc")
  );
  const docs = await getDocs(q);
  return docs.docs.map((d) => convertExpiredAt(d.data()));
};

export const getVacantShiftByMonth = async (yearMonth: Shift["yearMonth"]): Promise<Shift[]> => {
  const q = query(
    collection(db, "Shifts"),
    where("isFull", "==", false),
    where("yearMonth", "==", yearMonth),
    orderBy("startTime", "asc")
  );
  const docs = await getDocs(q);
  return docs.docs.map((d) => convertExpiredAt(d.data()));
};

export const signupShift = async (shiftId: Shift["id"], userId: User["id"]) => {
  //TODO:考慮5分鐘內可以取消的後端？
  await runTransaction(db, async (t) => {
    try {
      const shiftDoc = doc(db, "Shifts", shiftId);
      t.update(shiftDoc, { attendees: arrayUnion(userId) });
    } catch {
      throw new Error("SHIFT_TAKEN");
    }
  });
};

export const reportShift = async (shiftId: Shift["id"], attendeeCount: number) => {
  await runTransaction(db, async (t) => {
    const shiftDoc = doc(db, "Shifts", shiftId);
    t.update(shiftDoc, { attendeeCount });
  });
};

export const createShift = async (shift: Shift) => {
  await runTransaction(db, async (t) => {
    const shiftDoc = doc(db, "Shifts", shift.id);
    t.set(shiftDoc, shift);
  });
};

export const updateShift = async (shift: Shift) => {
  await runTransaction(db, async (t) => {
    const shiftDoc = doc(db, "Shifts", shift.id);
    t.update(shiftDoc, shift);
  });
};

export const deleteShift = async (shiftId: Shift["id"]) => {
  await runTransaction(db, async (t) => {
    const shiftDoc = doc(db, "Shifts", shiftId);
    t.delete(shiftDoc);
  });
};
