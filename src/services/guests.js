import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const ref = collection(db, "guests");

export const getGuests = async () =>
  (await getDocs(ref)).docs.map(d => ({ id: d.id, ...d.data() }));

export const updateGuestStatus = (id, status) =>
  updateDoc(doc(db, "guests", id), { status });
