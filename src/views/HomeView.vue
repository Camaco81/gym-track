<template> 
  <NavbarComponent/>

    <main class="d-flex flex-column justify-content-center align-items-center p-2 mx-auto">
      <div class="p-5 text-center"> <h2>Bienvenido administrador</h2>
        <p class="text-blue750">¿Qué clientes vamos a registrar hoy?</p>
      </div>
      </main>
</template>

<script>
import NavbarComponent from '@/components/NavbarComponent.vue';

export default {
  name: 'HomeView',
  components:{
     NavbarComponent : NavbarComponent
  },
  setup() { // Usamos setup para lógica de composición, alternativa a methods para componentes más complejos
    // No necesitamos una verificación de seguridad inicial aquí porque Vue Router ya lo manejará
    // con el navigation guard en router/in dex.js.
   
  },
  methods: {
   
  },
  mounted() {
    // Es una buena práctica asegurar que Bootstrap JS se inicie en este componente si lo necesitas.
    // Aunque si lo importas globalmente en main.js, no debería ser necesario aquí.
    // Solo si el dropdown no funciona, verificarías si hay un problema con Bootstrap JS.
  }
};
</script>

<style scoped lang="scss">
@import '../css/home.css';

</style>
