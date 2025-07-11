// src/firebase/clientService.js
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
  getDoc,
  updateDoc
} from "firebase/firestore"; // Importaciones de la v9 de Firebase SDK

import { app } from './firebaseConfig'; // Asegúrate de que esta ruta sea correcta

const db = getFirestore(app); // Inicializa Firestore con tu app de Firebase

export const saveClient = (nombre, ci, fecha, horario, rutinActual) =>
  addDoc(collection(db, "clients"), { nombre, ci, fecha, horario, rutinActual });

export const getClients = () => getDocs(collection(db, "clients"));

export const ongetClient = (callback) => onSnapshot(collection(db, "clients"), callback);

export const deleteClient = (id) => deleteDoc(doc(db, "clients", id));

export const getClient = (id) => getDoc(doc(db, "clients", id));

export const updateClient = (id, newFields) =>
  updateDoc(doc(db, "clients", id), newFields);
export const onGetClients = (callback) => onSnapshot(collection(db, "clients"), callback);