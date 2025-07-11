<template>
  <header class="bg-blue700 text-white d-flex align-items-center justify-content-center">
    <img class="rounded-3" src="../assets/logo.png" alt="GymTrack Logo">
    <h1 class="col-md-5 col-6 mx-3">Iniciar sesión</h1>
  </header>

  <main class="d-flex justify-content-center align-items-center">
    <form @submit.prevent="iniciarSesion" class="d-flex flex-column p-2 col-11 col-md-8">
      <h1 class="mb-2 text-blue750">Bienvenido de nuevo</h1>
      
      <label class="text-muted fw-semibold" for="email">Usuario</label>
      <input 
        required 
        autofocus 
        placeholder="Ingrese Usuario" 
        class="mb-2 p-2 rounded-3 border border-muted" 
        type="email" 
        id="email" 
        v-model="email"
      >
      
      <label class="text-muted fw-semibold" for="password">Contraseña</label>
      <div class="position-relative">
        <input 
          required 
          placeholder="Ingrese Contraseña" 
          class="mb-2 p-2 rounded-3 border border-muted col-12" 
          :type="passwordFieldType" 
          id="password" 
          v-model="password"
        >
        <i 
          class="bi bi-eye-fill position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer" 
          :class="{ 'bi-eye-fill': passwordFieldType === 'password', 'bi-eye-slash-fill': passwordFieldType === 'text' }"
          @click="togglePasswordVisibility"
        ></i>
      </div>
      
      <button type="submit" class="bg-blue700 text-white btn-login rounded-3 border-none p-2 mt-3">
        Iniciar Sesión
      </button>

      <p v-if="errorMessage" class="text-danger mt-2 text-center">{{ errorMessage }}</p>
    </form>
  </main>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/firebase/firebaseConfig'; // Asegúrate de que esta ruta sea correcta para tu configuración de Firebase
import router from '@/router'; // Importa tu instancia de Vue Router

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      passwordFieldType: 'password', // Controla la visibilidad de la contraseña
      errorMessage: '' // Para mostrar mensajes de error al usuario
    };
  },
  methods: {
    async iniciarSesion() {
      this.errorMessage = ''; // Limpia cualquier mensaje de error anterior
      const auth = getAuth(app);

      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        // Si el login es exitoso, redirige al dashboard (o a la página que quieras)
        router.push('/home'); // Usa router.push para navegar programáticamente
      } catch (error) {
        const errorCode = error.code;
        console.error("Error de inicio de sesión:", errorCode, error.message); // Para depuración

        switch (errorCode) {
          case "auth/invalid-email":
            this.errorMessage = "Correo electrónico inválido. Por favor, verifica el formato.";
            break;
          case "auth/user-disabled":
            this.errorMessage = "El usuario ha sido deshabilitado. Contacta al administrador.";
            break;
          case "auth/user-not-found":
            this.errorMessage = "No se encontró un usuario con este correo electrónico.";
            break;
          case "auth/wrong-password":
            this.errorMessage = "Contraseña incorrecta. Inténtalo de nuevo.";
            break;
          case "auth/missing-email":
            this.errorMessage = "Por favor, ingresa tu correo electrónico.";
            break;
          case "auth/invalid-credential": // Error genérico para credenciales inválidas
            this.errorMessage = "Credenciales inválidas. Verifica tu correo y contraseña.";
            break;
          default:
            this.errorMessage = "Ocurrió un error inesperado al iniciar sesión. Por favor, inténtalo de nuevo.";
            break;
        }
      }
    },
    togglePasswordVisibility() {
      // Alterna entre 'password' y 'text' para mostrar/ocultar la contraseña
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    }
  }
};
</script>

<style scoped lang="scss">
/* Aquí puedes pegar el contenido de tu archivo '../css/login.css' */
/* Asegúrate de que las rutas de las imágenes si las usas en el CSS también sean correctas */
@import '../css/login.css';
@import '../css/colors.css';
@import '../css/font.css';


</style>

