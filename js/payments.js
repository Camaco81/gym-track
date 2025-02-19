
import  "../firebase/app.js";
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

 const db= getFirestore();
 export const saveClient=(nombre, ci, fecha_pago, concepto, forma_pago,monto,estado)=>
  addDoc(collection(db, "payments"),{nombre, ci, fecha_pago, concepto, forma_pago,monto,estado})

  export const getClients= ()=> getDocs(collection(db, "payments"));

  export const ongetClient= (callback)=> onSnapshot(collection(db,"payments"),callback);

  export const deleteClient= (id) => deleteDoc(doc(db, "payments", id));

  export const getClient = (id) => getDoc(doc(db, "payments", id));

  export const updateClient= (id, newFields)=>
  updateDoc(doc(db,"payments",id),newFields);


const clientForm= document.getElementById("clientForm");
const clientEditForm=document.getElementById("clientEditForm");
const clientsContainer= document.getElementById("clientes-container");



let editStatus= false;

let id="";

window.addEventListener('DOMContentLoaded', async() => {
  ongetClient((querySnapshot)=>{
    clientsContainer.innerHTML="";

    querySnapshot.forEach((dc)=>{

    const client = dc.data();

     clientsContainer.innerHTML += `

     
      <div>
         <tr class="">
                <td>${client.nombre}</td>
                <td>${client.ci}</td>
                <td>${client.fecha_pago}</td>
                <td>${client.concepto}</td>
                <td>${client.forma_pago}</td>
                 <td>${client.monto}</td>
                 <td>${client.estado}</td>
                <td scope="row">
                <button class=" mb-1 btn btn-danger btn-delete" data-id="${dc.id}"><i class="fa-solid fa-trash-can m-1"></i></button>
                <button class=" mb-1 btn btnEditStyle bg-blue700 btn-edit" data-id="${dc.id}" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i class="fa-solid fa-pen-to-square m-1"></i></button> 
                </td>
               
                
        </tr> 
     </div>`;
  });



//   const buscador = document.getElementById('inputBusqueda');

// // Función para filtrar los empleados en tiempo real
// function filtrarEmpleados() {
//   const terminoBusqueda = buscador.value.toLowerCase();
//   const filas = employersContainer.querySelectorAll('tr');

//   filas.forEach(fila => {
//     const nombreCelda = fila.querySelector('td:nth-child(2)'); // Asumiendo que el nombre está en la segunda celda
//     const nombre = nombreCelda.textContent.toLowerCase();
//     fila.style.display = nombre.includes(terminoBusqueda) ? '' : 'none';
//   });
// }

// Evento para filtrar al escribir en el buscador
// buscador.addEventListener('input', filtrarEmpleados);


    const btnsDelete= clientsContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach(btn=>{
      btn.addEventListener('click',({target:{dataset}})=>{
       deleteClient(dataset.id);
      });
    });

    const btnsEdit= clientsContainer.querySelectorAll(".btn-edit");

    btnsEdit.forEach(btn=>{
      btn.addEventListener('click', async({target:{dataset}})=>{
       const doc = await getClient(dataset.id);
       const client= doc.data();
        clientEditForm["nombre_completo"].value=client.nombre;
        clientEditForm["cedula"].value=client.ci;
        clientEditForm["fecha_pago"].value=client.fecha_pago;
        clientEditForm["concepto"].value=client.concepto;
        clientEditForm["forma_pago"].value=client.forma_pago;
        clientEditForm["monto"].value=client.monto;
         clientEditForm["estado"].value=client.estado;
     
     
       id=doc.id;
      
     });
    });



  
 });

});


clientForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre= clientForm['nombre_completo'].value;
  const ci= clientForm['cedula'].value;
  const fecha= clientForm['fecha_pago'].value;
  const concepto= clientForm['concepto'].value;
  const forma_pago=clientForm['forma_pago'].value;
  const monto= clientForm['monto'].value;
  const estado= clientForm['estado'].value;
 

  saveClient(nombre, ci, fecha, concepto, forma_pago,monto,estado);
 Swal.fire({
        icon:"success",
        title:"Pago registrado exitosamente",
        confirmButtonText:"Aceptar"
      });
   clientForm.reset();
});


// const btnEditModal=document.getElementById("btn-client-edit");

clientEditForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  const nombre= clientEditForm['nombre_completo'];
  const ci= clientEditForm['cedula'];
  const fecha= clientEditForm['fecha_pago'];
  const concepto= clientEditForm['concepto'];
  const forma_pago=clientEditForm['forma_pago'];
  const monto= clientEditForm['monto'];
  const estado=clientEditForm['estado'];

   updateClient( id,{
      nombre:nombre.value,
      ci: ci.value,
      fecha: fecha.value,
      concepto:concepto.value,
      forma_pago:rutinActual.value,
      monto:monto.value,
      estado:estado.value

      
    });
 Swal.fire({
        icon:"success",
        title:"Datos actualizados  exitosamente",
        confirmButtonText:"Aceptar"
      });
   clientEditForm.reset();
});





  