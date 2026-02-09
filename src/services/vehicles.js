import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const ref = collection(db, "vehicles");

export const getVehicles = async () =>
  (await getDocs(ref)).docs.map(d => ({ id: d.id, ...d.data() }));

export const addVehicle = (v) => addDoc(ref, v);
export const updateVehicleStatus = (id, status) =>
  updateDoc(doc(db, "vehicles", id), { status });
