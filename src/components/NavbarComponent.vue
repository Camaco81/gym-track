<template>
  <nav class="navbar-custom bg-blue700 text-white p-0">
    <div class="col-3 logo-container">
      <img src="../assets/logo.png" alt="Logo GymTrack" class="img-fluid">
    </div>

    <div class="col-6 page-title-container d-flex justify-content-center align-items-center">
      
      </div>

    <div class="col-3 menu-container d-flex justify-content-end align-items-center">
      <ul class="d-flex mb-0"> <div class="dropdown">
          <a class="dropdown-toggle menu text-white p-2 text-decoration-none" href="#" role="button" id="dropdownMenuLink"
            data-bs-toggle="dropdown" aria-expanded="false">
            Menu
          </a>

          <ul class="dropdown-menu p-2" aria-labelledby="dropdownMenuLink">
            <li class="item">
              <router-link to="/home" class="text-decoration-none text-blue750">
                <i class="bi bi-house-fill"></i> Inicio
              </router-link>
            </li>
            <li class="item">
              <router-link to="/clients" class="text-decoration-none text-blue750">
                <i class="bi bi-people-fill"></i> Clientes
              </router-link>
            </li>
            <li class="item">
              <router-link to="/notifications" class="text-decoration-none text-blue750">
                <i class="bi bi-bell-fill"></i> Notificaciones
              </router-link>
            </li>
            <li class="item">
              <router-link to="/payments" class="text-decoration-none text-blue750">
                <i class="bi bi-currency-dollar"></i> Pagos </router-link>
            </li>
            <li class="item">
              <a class="text-decoration-none text-blue750" @click="handleLogout">
                <i class="bi bi-box-arrow-right"></i> Salir
              </a>
            </li>
          </ul>
        </div>
      </ul>
    </div>
  </nav>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/firebase/firebaseConfig';
import router from '@/router';
import Swal from 'sweetalert2';

export default {
  name: 'NavbarComponent',
  props: {
    pageTitle: {
      type: String,
      default: '' // Valor predeterminado si no se pasa la prop
    }
  },
  methods: {
    async handleLogout() {
      const auth = getAuth(app);
      try {
        await signOut(auth);
        router.push('/login');
        Swal.fire({
          icon: 'success',
          title: '¡Sesión cerrada!',
          text: 'Has cerrado sesión exitosamente.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cerrar sesión',
          text: 'No se pudo cerrar sesión. Inténtalo de nuevo.'
        });
      }
    }
  }
};
</script>

<style scoped>
@import '../css/colors.css';
/* Estilos generales del Navbar */
.navbar-custom {
  display: flex; /* Usamos flexbox para el layout principal */
  justify-content: space-between; /* Espacio entre los elementos */
  align-items: center; /* Alineación vertical */
  height: 60px; /* Altura fija para el navbar */
  /* Ajusta p-0 en el template, no aquí */
}

/* Contenedor del logo */
.logo-container {
  height: 100%; /* Asegura que el contenedor del logo ocupe la altura completa */
  display: flex;
  align-items: center; /* Centra verticalmente el logo */
  padding-left: 15px; /* Pequeño padding a la izquierda para el logo */
}

.logo-container img {
  max-height: 80%; /* Ajusta el tamaño del logo dentro de su contenedor */
  width: auto;
}

/* Contenedor del título de la página */
.page-title-container {
  text-align: center; /* Asegura que el texto dentro del div esté centrado */
}

.page-title-container h3 {
  color: white; /* Color del texto del título */
  font-size: 1.5rem; /* Tamaño de fuente para el título */
  /* Otros estilos como font-weight se manejan con clases de Bootstrap (fw-bold) */
}

/* Contenedor del menú */
.menu-container {
  padding-right: 15px; /* Pequeño padding a la derecha para el menú */
}



.text-white {
  color: white;
}



/* Estilos para el dropdown */
.dropdown-menu {
  background-color: white;
  border: 1px solid #ddd;
  /* Alineación del menú a la derecha si es necesario */
  left: auto;
  right: 0;
}

.dropdown-item {
  padding: 0; /* Quitar padding por defecto para que el router-link lo defina */
}

.dropdown-menu .item {
  padding: 8px 15px; /* Padding para cada ítem del menú */
}

.dropdown-menu .item:hover {
  background-color: #f8f9fa; /* Color al pasar el mouse */
}

.dropdown-menu .item .text-decoration-none {
  display: block; /* Para que el link ocupe todo el espacio del li */
}
</style>