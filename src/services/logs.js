import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const ref = collection(db, "logs");

export const addLog = (log) => addDoc(ref, log);
export const getLogs = async () =>
  (await getDocs(ref)).docs.map(d => ({ id: d.id, ...d.data() }));
