import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle'; 
import 'bootstrap/dist/js/bootstrap'; 
import 'bootstrap/dist/js/bootstrap.esm'; 

createApp(App).use(store).use(router).mount('#app')
