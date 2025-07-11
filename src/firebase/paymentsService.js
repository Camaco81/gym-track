// src/firebase/paymentsService.js
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore"; // Use "firebase/firestore" not the old cdn path

const db = getFirestore();

export const savePayment = (nombre, ci, fecha_pago, concepto, forma_pago, monto, estado) =>
  addDoc(collection(db, "payments"), { nombre, ci, fecha_pago, concepto, forma_pago, monto, estado });

export const getPayments = () => getDocs(collection(db, "payments"));

export const onGetPayments = (callback) => onSnapshot(collection(db, "payments"), callback);

export const deletePayment = (id) => deleteDoc(doc(db, "payments", id));

export const getPayment = (id) => getDoc(doc(db, "payments", id));

export const updatePayment = (id, newFields) =>
  updateDoc(doc(db, "payments", id), newFields);
