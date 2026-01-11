import { db } from "@/lib/firebase";
import type { Schedule } from "@/types/schedule";
import type { User } from "@/types/user";
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";

export const getSchedule = async (userId: User["id"]) => {
  const ref = doc(db, "Users", userId, "Schedule", "config");
  const scheduleDoc = await getDoc(ref);
  return scheduleDoc.data() as Schedule;
};

export const updateSchedule = async (schedule: Schedule) => {
  const ref = doc(db, "Users", schedule.userId, "Schedule", "config");
  await updateDoc(ref, schedule);
};
