<template>
  <div id="contenido-protegido">
    <NavbarComponent pageTitle="Notificaciones" /> 

    <main class="d-flex flex-column justify-content-center align-items-center p-3">
      <div id="notificaciones" class="d-flex flex-column col-11 col-md-8 gap-3 ">
        <h1 class="text-blue700 fw-semibold ">Notificaciones</h1>
        <p v-if="allAlerts.length === 0" class="text-muted text-center p-4 border rounded shadow-sm">
          ¡Todo en orden! No hay alertas de rutinas o mensualidades vencidas/próximas a vencer.
        </p>

        <template v-if="sortedRoutineAlerts.length > 0">
          <h4 class="text-blue750 fw-semibold mt-1 mb-2">Alertas de Rutinas</h4>
          <div v-for="alert in sortedRoutineAlerts" :key="alert.id + alert.type"
            :class="['notification-item', 'p-3', 'rounded-3', 'shadow-sm', 'd-flex', 'flex-column', 'gap-1', 'justify-content-between', 'align-items-start', { 'bg-danger-light': alert.status === 'vencida', 'bg-warning-light': alert.status === 'por-vencer' }]">

            <h5 class="fw-bold mb-1" :class="{'text-danger': alert.status === 'vencida', 'text-warning': alert.status === 'por-vencer'}">
              <i class="fa-solid fa-dumbbell me-2"></i>
              <template v-if="alert.status === 'vencida'">¡Rutina Vencida!</template>
              <template v-else>¡Rutina por Vencer Pronto!</template>
            </h5>
            <p class="mb-0">
              <span class="fw-semibold">Cliente:</span> {{ alert.clientName }}
            </p>
            <p class="mb-0">
              <span class="fw-semibold">Cédula:</span> {{ alert.clientCi }}
            </p>
            <p class="mb-0">
              <span class="fw-semibold">Fecha de Inicio de Rutina:</span> {{ formatDate(alert.startDate) }}
            </p>
            <p class="mb-0">
              <span class="fw-semibold">Fecha Estimada de Vencimiento:</span> {{ formatDate(alert.dueDate) }}
            </p>
            <p class="mb-0">
              <span class="fw-semibold">Estado:</span>
              <span :class="{'text-danger': alert.status === 'vencida', 'text-warning': alert.status === 'por-vencer'}">
                {{ Math.abs(alert.daysRemaining) }} día(s) hábiles {{ alert.daysRemaining <= 0 ? 'pasado(s)' : 'restante(s)' }}
              </span>
            </p>
            <small class="text-muted mt-2">Horario: {{ alert.horario }} | Rutina Actual: {{ alert.rutinActual }}</small>
          </div>
        </template>

        <template v-if="sortedPaymentAlerts.length > 0">
          <h4 class="text-blue750 fw-semibold mt-4 mb-2">Alertas de Mensualidades</h4>
          <div v-for="alert in sortedPaymentAlerts" :key="alert.id + alert.type"
            :class="['notification-item', 'p-3', 'rounded-3', 'shadow-sm', 'd-flex', 'flex-column', 'gap-1', 'justify-content-between', 'align-items-start', { 'bg-danger-light': alert.status === 'vencida', 'bg-warning-light': alert.status === 'por-vencer' }]">

            <h5 class="fw-bold mb-1" :class="{'text-danger': alert.status === 'vencida', 'text-warning': alert.status === 'por-vencer'}">
              <i class="fa-solid fa-dollar-sign me-2"></i>
              <template v-if="alert.status === 'vencida'">¡Mensualidad Vencida!</template>
              <template v-else>¡Mensualidad por Vencer Pronto!</template>
            </h5>
            <p class="mb-0">
              <span class="fw-semibold">Cliente:</span> {{ alert.clientName }}
            </p>
            <p class="mb-0">
              <span class="fw-semibold">Cédula:</span> {{ alert.clientCi }}
            </p>
            <p class="mb-0">
              <span class="fw-semibold">Fecha de Vencimiento de Pago:</span> {{ formatDate(alert.dueDate) }}
            </p>
            <p class="mb-0">
              <span class="fw-semibold">Concepto:</span> {{ alert.concept }}
            </p>
            <p class="mb-0">
              <span class="fw-semibold">Estado:</span>
              <span :class="{'text-danger': alert.status === 'vencida', 'text-warning': alert.status === 'por-vencer'}">
                {{ Math.abs(alert.daysRemaining) }} día(s) {{ alert.daysRemaining <= 0 ? 'pasado(s)' : 'restante(s)' }}
              </span>
            </p>
          </div>
        </template>

      </div>
    </main>
  </div>
</template>

<script>
import NavbarComponent from '@/components/NavbarComponent.vue';
import { onGetClients } from '@/firebase/clientService';
import { onGetPayments } from '@/firebase/paymentsService'; // Asegúrate que la ruta sea correcta

export default {
  name: 'NotificationsView',
  components: {
    NavbarComponent,
  },
  data() {
    return {
      allClients: [],
      allPayments: [],
    };
  },
  computed: {
    routineAlerts() {
      const alerts = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const routineDurationWorkingDays = 40; // 8 weeks * 5 working days/week
      const routineExpiringSoonWorkingDays = 5; // e.g., 1 week before due

      this.allClients.forEach(client => {
        if (!client.fecha) return; // 'fecha' is the routine start date for clients

        const startDate = new Date(client.fecha + 'T00:00:00');
        startDate.setHours(0, 0, 0, 0);

        const calculatedDueDate = this.addWorkingDays(startDate, routineDurationWorkingDays);

        const workingDaysRemaining = this.getWorkingDaysRemaining(calculatedDueDate, today);

        let status = '';
        if (workingDaysRemaining <= 0) {
          status = 'vencida';
        } else if (workingDaysRemaining > 0 && workingDaysRemaining <= routineExpiringSoonWorkingDays) {
          status = 'por-vencer';
        }

        if (status) {
          alerts.push({
            id: client.id,
            type: 'routine',
            status: status,
            clientName: client.nombre,
            clientCi: client.ci,
            startDate: client.fecha,
            dueDate: calculatedDueDate.toISOString().slice(0, 10), // Calculated routine due date
            daysRemaining: workingDaysRemaining,
            horario: client.horario,
            rutinActual: client.rutinActual,
            sortValue: workingDaysRemaining,
          });
        }
      });
      return alerts;
    },

    // Genera alertas de pagos (mensualidades) directamente desde la colección 'payments'
    paymentAlerts() {
      const alerts = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const paymentExpiringSoonDays = 7; // e.g., 7 days before payment due

      this.allPayments.forEach(payment => {
        // *** ÚNICA Y CORRECTA CONDICIÓN DE FILTRADO PARA PAGOS ***
        // Acepta 'Mensualidad' o 'Mes', y verifica que existan campos esenciales
        const validConcepts = ['Mensualidad', 'Mes'];
        if (!validConcepts.includes(payment.concepto) || !payment.fecha_pago || !payment.ci || !payment.nombre) {
          // console.log("Skipping payment due to invalid concept or missing data:", payment.id, payment.concepto); // Re-habilitar para depurar
          return; 
        }

        // 1. Calcular la fecha de vencimiento (1 mes después de fecha_pago)
        const paymentDate = new Date(payment.fecha_pago + 'T00:00:00');
        paymentDate.setHours(0, 0, 0, 0);

        if (isNaN(paymentDate.getTime())) { 
          // console.log("Skipping: Invalid fecha_pago format. Value:", payment.fecha_pago); // Re-habilitar para depurar
          return;
        }

        const paymentDueDate = new Date(paymentDate); 
        paymentDueDate.setMonth(paymentDueDate.getMonth() + 1); 

        // 2. Calcular días restantes desde hoy hasta la paymentDueDate calculada
        const diffTime = paymentDueDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let status = '';
        if (daysRemaining <= 0) { 
          status = 'vencida';
        } else if (daysRemaining > 0 && daysRemaining <= paymentExpiringSoonDays) {
          status = 'por-vencer'; 
        }

        if (status) {
          alerts.push({
            id: payment.id, 
            type: 'payment',
            status: status,
            clientName: payment.nombre, 
            clientCi: payment.ci, 
            dueDate: paymentDueDate.toISOString().slice(0, 10), 
            concept: payment.concepto,
            daysRemaining: daysRemaining,
            sortValue: daysRemaining,
          });
        }
      });
      // console.log("Total payment alerts generated:", alerts.length); // Re-habilitar para depurar
      return alerts;
    },

    // Combina todas las alertas para el mensaje general "Todo en orden"
    allAlerts() {
      return [...this.routineAlerts, ...this.paymentAlerts];
    },
    
    // Propiedad computada para ordenar solo las alertas de rutina
    sortedRoutineAlerts() {
        return [...this.routineAlerts].sort((a, b) => a.sortValue - b.sortValue);
    },

    // Propiedad computada para ordenar solo las alertas de pago
    sortedPaymentAlerts() {
        return [...this.paymentAlerts].sort((a, b) => a.sortValue - b.sortValue);
    }
  },
  mounted() {
    // Suscribe a cambios en la colección de clientes
    onGetClients((querySnapshot) => {
      this.allClients = [];
      querySnapshot.forEach((doc) => {
        this.allClients.push({
          id: doc.id,
          ...doc.data()
        });
      });
    });

    // Suscribe a cambios en la colección de pagos
    onGetPayments((querySnapshot) => {
      this.allPayments = [];
      querySnapshot.forEach((doc) => {
        this.allPayments.push({
          id: doc.id,
          ...doc.data()
        });
      });
    });
  },
  methods: {
    // Calcula la fecha sumando días hábiles (L-V)
    addWorkingDays(startDate, daysToAdd) {
      let currentDate = new Date(startDate.getTime()); 
      let addedDays = 0;

      while (addedDays < daysToAdd) {
        currentDate.setDate(currentDate.getDate() + 1); 
        const dayOfWeek = currentDate.getDay(); 
        if (dayOfWeek >= 1 && dayOfWeek <= 5) { 
          addedDays++;
        }
      }
      return currentDate;
    },

    // Calcula los días hábiles restantes o pasados entre dos fechas
    getWorkingDaysRemaining(dueDate, today) {
      if (!dueDate || !today) return Infinity;

      const normalizedDueDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
      const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      let current = new Date(normalizedToday.getTime());
      let days = 0;

      if (normalizedDueDate.getTime() <= normalizedToday.getTime()) {
        while (current.getTime() >= normalizedDueDate.getTime()) {
          const dayOfWeek = current.getDay();
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            days--; 
          }
          current.setDate(current.getDate() - 1);
        }
      } else {
        while (current.getTime() < normalizedDueDate.getTime()) {
          current.setDate(current.getDate() + 1);
          const dayOfWeek = current.getDay();
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            days++; 
          }
        }
      }
      return days;
    },

    // Formatea la fecha para una mejor visualización (e.g., "11 de julio de 2025")
    formatDate(dateString) {
      if (!dateString) return 'Fecha no disponible';
      try {
        const dateObj = new Date(dateString + 'T00:00:00'); 
        if (isNaN(dateObj.getTime())) { 
          return 'Fecha inválida';
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return dateObj.toLocaleDateString('es-ES', options);
      } catch (error) {
        console.error("Error al formatear fecha:", dateString, error);
        return dateString;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../css/notificaciones.css';

.notification-item {
  border-left: 5px solid;
  padding-left: 1rem;
  transition: all 0.3s ease-in-out;
}

.bg-danger-light {
  background-color: #fce4e4;
  border-color: #ef5350;
}

.bg-warning-light {
  background-color: #fffde7;
  border-color: #ffca28;
}

.text-danger {
  color: #ef5350 !important;
}

.text-warning {
  color: #ffca28 !important;
}
</style>
