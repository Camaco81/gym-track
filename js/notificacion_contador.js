import "../firebase/app.js";
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
    where, 
    query
     } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const db = getFirestore();

const notificiones=document.getElementById("notificaciones");

// Función para calcular la fecha 8 semanas después de una fecha dada, excluyendo sábados y domingos
function addWeeks(date, weeks, excludeWeekends = true) {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);

  // Si se deben excluir fines de semana, ajustamos la fecha
  if (excludeWeekends) {
    while (result.getDay() === 0 || result.getDay() === 6) {
      result.setDate(result.getDate() + 1);
    }
  }
  return result;
}

// Función principal para verificar las rutinas vencidas
async function checkExpiredRoutines() {
  const clientsCollection = collection(db, "clients");
  const today = new Date();

  // Consulta para obtener todos los clientes
  const querySnapshot = await getDocs(clientsCollection);

  querySnapshot.forEach((doc) => {
    const clientData = doc.data();
    const startDate = new Date(clientData.fecha); // Suponiendo que "fecha" es el campo con la fecha de inicio
    const endDate = addWeeks(startDate, 8);

    if (endDate < today) {
        const clientName= clientData.nombre;
        notificaciones.innerHTML+= `<p class="mb-1 mt-1 mx-1 p-2 ">La rutina del cliente <span class="fw-semibold text-blue700">${clientName}</span> ha vencido</p>`;
    
      // Aquí puedes realizar acciones adicionales, como enviar notificaciones, actualizar la base de datos, etc.
    }
    else{
        const clientName= clientData.nombre;
        notificaciones.innerHTML+= `<p class="mb-1 mt-1 mx-1 p-2 "> La rutina del cliente <span  class="fw-semibold text-blue750">${clientName}</span> todavia le falta por vencer</p>`;
    }
  });
}

// Llamamos a la función para ejecutar la verificación
checkExpiredRoutines();






