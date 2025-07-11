// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginView.vue'; // Asegúrate de que la ruta sea correcta
import HomeView from '../views/HomeView.vue'; // El componente de tu dashboard (ej. home.html)}
import ClientsView from '@/views/ClientsView.vue';
import NotificationsView from '@/views/NotificationsView.vue';
import PaymentsView from '@/views/PaymentsView.vue';
// Importa Firebase Auth para el navigation guard
import { getAuth } from 'firebase/auth'; 
import { app } from '../firebase/firebaseConfig'; // Tu configuración de Firebase

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/home', // O '/home' si prefieres que la URL sea más descriptiva
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
   {
    path: '/clients', 
    name: 'client',
    component: ClientsView
  },
    {
    path: '/notifications', 
    name: 'notification',
    component: NotificationsView
  },
     {
    path: '/payments', 
    name: 'payments',
    component:PaymentsView
  },
  // Redirige la ruta raíz a login si no está autenticado, o a dashboard si sí lo está
 {
  path: '/',
  redirect: () => { // <-- 'to' eliminado
    const auth = getAuth(app);
    if (auth.currentUser) {
      return { path: '/home' };
    } else {
      return { path: '/login' };
    }
  }
},
  // Captura cualquier otra ruta no definida y redirige a login
  { 
    path: '/:catchAll(.*)', 
    redirect: '/login' 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard para proteger rutas
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const auth = getAuth(app); // Obtén la instancia de auth aquí
  const isAuthenticated = !!auth.currentUser; // true si hay un usuario logeado, false si no

  if (requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario NO está autenticado, redirige a login
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    // Si el usuario ya está autenticado y trata de ir a la página de login, redirige al dashboard
    next('/dashboard');
  } else {
    // Si no hay restricciones o si se cumplen, permite el acceso
    next();
  }
});

export default router;