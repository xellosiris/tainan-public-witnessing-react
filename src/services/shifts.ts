import { db } from "@/lib/firebase";
import type { Shift } from "@/types/shift";
import type { User } from "@/types/user";
import { collection, getDocs, query, Timestamp, where } from "firebase/firestore/lite";

const convertShiftTimestamps = (data: any): Shift => {
  return {
    ...data,
    expiredAt: (data.expiredAt as Timestamp).toDate(),
  } as Shift;
};

export const getShiftsByDate = async (date: string): Promise<Shift[]> => {
  const q = query(collection(db, "Shifts"), where("date", "==", date));
  const docs = await getDocs(q);
  return docs.docs.map((d) => convertShiftTimestamps(d.data()));
};

export const getPersonalShiftByMonth = async (id: User["id"], yearMonth: Shift["yearMonth"]): Promise<Shift[]> => {
  const q = query(
    collection(db, "Shifts"),
    where("attendees", "array-contains", id),
    where("yearMonth", "==", yearMonth)
  );
  const docs = await getDocs(q);
  return docs.docs.map((d) => convertShiftTimestamps(d.data()));
};

export const getVacantShiftByMonth = async (yearMonth: Shift["yearMonth"]): Promise<Shift[]> => {
  const q = query(collection(db, "Shifts"), where("isFull", "==", false), where("yearMonth", "==", yearMonth));
  const docs = await getDocs(q);
  return docs.docs.map((d) => convertShiftTimestamps(d.data()));
};
