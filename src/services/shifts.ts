import { db } from "@/lib/firebase";
import type { Shift } from "@/types/shift";
import type { User } from "@/types/user";
import { collection, getDocs, query, where } from "firebase/firestore/lite";

export const getShiftsByDate = async (date: string): Promise<Shift[]> => {
  const q = query(collection(db, "Shifts"), where("date", "==", date));
  const docs = await getDocs(q);
  return docs.docs.map((d) => d.data()) as Shift[];
};

export const getPersonalShiftByMonth = async (id: User["id"], yearMonth: Shift["yearMonth"]): Promise<Shift[]> => {
  const q = query(
    collection(db, "Shifts"),
    where("attendees", "array-contains", id),
    where("yearMonth", "==", yearMonth)
  );
  const docs = await getDocs(q);
  return docs.docs.map((d) => d.data()) as Shift[];
};

export const getVacantShiftByMonth = async (yearMonth: Shift["yearMonth"]): Promise<Shift[]> => {
  const q = query(collection(db, "Shifts"), where("isFull", "==", false), where("yearMonth", "==", yearMonth));
  const docs = await getDocs(q);
  return docs.docs.map((d) => d.data()) as Shift[];
};
