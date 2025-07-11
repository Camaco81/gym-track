// src/firebase/notificationService.js
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
  getDoc,
  updateDoc, // Añadido updateDoc por si alguna vez editas notificaciones
  query,
  where,
} from "firebase/firestore";

const db = getFirestore();

// Ejemplo de función para guardar una notificación (puedes ajustar los campos)
export const saveNotification = (title, message, date, isRead = false) =>
  addDoc(collection(db, "notifications"), { title, message, date, isRead });

export const getNotifications = () => getDocs(collection(db, "notifications"));

export const onGetNotifications = (callback) => onSnapshot(collection(db, "notifications"), callback);

export const deleteNotification = (id) => deleteDoc(doc(db, "notifications", id));

export const getNotification = (id) => getDoc(doc(db, "notifications", id));

export const updateNotification = (id, newFields) =>
  updateDoc(doc(db, "notifications", id), newFields);

// Función para marcar una notificación como leída (ejemplo)
export const markNotificationAsRead = (id) =>
  updateDoc(doc(db, "notifications", id), { isRead: true });

// Función para obtener notificaciones no leídas (ejemplo)
export const getUnreadNotifications = (callback) => {
  const q = query(collection(db, "notifications"), where("isRead", "==", false));
  return onSnapshot(q, callback);
};