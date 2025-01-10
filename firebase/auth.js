import { getAuth, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import  { app } from "./app.js";
const formLogin= document.getElementById("formLogin");

formLogin.addEventListener("click",()=>{

	iniciarSesion();
})


function iniciarSesion(){
	let email= document.getElementById("email").value;
	let password= document.getElementById("password").value;

	const auth=getAuth(app);

	 signInWithEmailAndPassword(auth,email,password).then(cred=>{
  
      location.href="../pages/clientes.html";

    }).catch(error => {
      const errorCode= error.code;
      if (errorCode=="auth/invalid-email") {
        alert("Correo invalido");
      }else if(errorCode=="auth/user-disable"){
        alert("El usuario ha sido deshabilitado");
      }else if(errorCode=="auth/user-not-found"){
        alert("El usuario no existe");
      }else if(errorCode=="auth/wrong-password"){
        alert("Contraseña incorrecta");
      }
      
    });


}