<template>
  <div id="contenido-protegido">
    <NavbarComponent />
    <h1 class="text-blue700 fw-semibold"><i class="fa-solid fa-dollar mx-2"></i> Pagos</h1>

    <main class="d-flex flex-column justify-content-center align-items-center">
      <form @submit.prevent="saveNewPayment" class="d-flex flex-column col-11 col-md-8 mb-4 p-4">
        <label class="text-blue700 fw-semibold" for="new_nombre_completo">Nombre completo</label>
        <input placeholder="Ingresa nombre completo" class="mb-2 p-2 rounded-3 border border-muted" required
          id="new_nombre_completo" type="text" v-model="newPayment.nombre">

        <label class="text-blue700 fw-semibold" for="new_cedula">Cedula</label>
        <input placeholder="Ingresa cedula" class="mb-2 p-2 rounded-3 border border-muted" required id="new_cedula"
          type="text" v-model="newPayment.ci">

        <label class="text-blue700 fw-semibold" for="new_fecha_pago">Fecha de pago</label>
        <input class="mb-2 p-2 rounded-3 border border-muted" required id="new_fecha_pago" type="date"
          v-model="newPayment.fecha_pago">

        <label class="text-blue700 fw-semibold" for="new_concepto">Concepto</label>
        <input required id="new_concepto" type="text" placeholder="Semana o mensualidad"
          class="rounded-3 border border-muted p-2" v-model="newPayment.concepto">

        <label class="text-blue700 fw-semibold mt-2" for="new_forma_pago">Forma de pago</label>
        <input placeholder="Ingresa forma de pago" class="mb-2 p-2 rounded-3 border border-muted" required
          id="new_forma_pago" type="text" v-model="newPayment.forma_pago">

        <label class="text-blue700 fw-semibold mt-2" for="new_monto">Monto</label>
        <input placeholder="Ingresa monto" class="mb-2 p-2 rounded-3 border border-muted" required id="new_monto"
          type="text" v-model="newPayment.monto">

        <label class="text-blue700 fw-semibold mt-2" for="new_estado">Estado</label>
        <input placeholder="Pago, pendiente, vencida" class="mb-2 p-2 rounded-3 border border-muted" required
          id="new_estado" type="text" v-model="newPayment.estado">

        <button type="submit" class="btn-save bg-blue700 text-white rounded-3 border-none p-2 mt-3">
          {{ editStatus ? 'Actualizar Pago' : 'Registrar Pago' }}
        </button>
      </form>
    </main>

    <div class="table-responsive rounded-3 p-2 mx-2">
      <table class="table rounded-3" id="miTabla">
        <thead>
          <tr>
            <th class="text-blue700" scope="col">Nombre completo</th>
            <th class="text-blue700" scope="col">Cedula</th>
            <th class="text-blue700" scope="col">Fecha de pago</th>
            <th class="text-blue700" scope="col">Concepto</th>
            <th class="text-blue700" scope="col">Forma de pago</th>
            <th class="text-blue700" scope="col">Monto</th>
            <th class="text-blue700" scope="col">Estado</th>
            <th class="text-blue700" scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in payments" :key="payment.id">
            <td>{{ payment.nombre }}</td>
            <td>{{ payment.ci }}</td>
            <td>{{ payment.fecha_pago }}</td>
            <td>{{ payment.concepto }}</td>
            <td>{{ payment.forma_pago }}</td>
            <td>{{ payment.monto }}</td>
            <td>{{ payment.estado }}</td>
            <td scope="row">
              <button class="mb-1 btn btn-danger btn-delete" @click="deletePaymentById(payment.id)">
                <i class="bi bi-trash3-fill m-1"></i>
              </button>
              <button class="mb-1 btn btn-btn-success bg-blue700 btn-edit" @click="editPayment(payment.id)"
                data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                <i class="bi bi-pencil-fill m-1"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button @click="generateExcel" class="btn btn-success mx-2 mb-2 mt-2">
      <i class="fas fa-file-excel mx-1"></i> Generar Excel
    </button>

    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
      aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-secondary text-white">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Editar pago</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body bg-blue200">
            <form @submit.prevent="updateExistingPayment" id="paymentEditForm" class="d-flex flex-column grid gap-2">
              <div>
                <label for="edit_nombre_completo" class="fw-semibold">Nombre completo</label>
                <input placeholder="Ingresa nombre completo" type="text" class="rounded-2 p-1 col-11 border border-muted"
                  id="edit_nombre_completo" v-model="currentPayment.nombre">
              </div>

              <div class="d-flex grid gap-1">
                <div class="col-6 d-flex flex-column">
                  <label for="edit_cedula" class="fw-semibold">Cedula</label>
                  <input placeholder=" Ingresa cedula" type="text" class="rounded-2 p-1 col-11 border border-muted"
                    id="edit_cedula" v-model="currentPayment.ci">
                </div>

                <div class="col-6 d-flex flex-column">
                  <label class="fw-semibold" for="edit_fecha_pago">Fecha de pago</label>
                  <input class="mb-2 p-2 rounded-3 border border-muted" required id="edit_fecha_pago" type="date"
                    v-model="currentPayment.fecha_pago">
                </div>
              </div>

              <div class="d-flex grid gap-1">
                <div class="col-6 d-flex flex-column">
                  <label class="fw-semibold" for="edit_concepto">Concepto</label>
                  <input required id="edit_concepto" class="rounded-3 p-2 border border-muted " type="text"
                    placeholder="Semana o mensualidad" v-model="currentPayment.concepto">
                </div>
                <div class="col-6 d-flex flex-column">
                  <label class="fw-semibold mt-2" for="edit_forma_pago">Forma de pago</label>
                  <input placeholder="Ingresa forma de pago" class="mb-2 p-2 rounded-3 border border-muted" required
                    id="edit_forma_pago" type="text" v-model="currentPayment.forma_pago">
                </div>
              </div>

              <div class="d-flex grid gap-1">
                <div class="col-6 d-flex flex-column">
                  <label class="fw-semibold mt-2" for="edit_monto">Monto</label>
                  <input placeholder="Monto" class="mb-2 p-2 rounded-3 border border-muted" required id="edit_monto"
                    type="text" v-model="currentPayment.monto">
                </div>
                <div class="col-6 d-flex flex-column">
                  <label class="fw-semibold mt-2" for="edit_estado">Estado</label>
                  <input placeholder="Pago, pendiente, vencida" class="mb-2 p-2 rounded-3 border border-muted" required
                    id="edit_estado" type="text" v-model="currentPayment.estado">
                </div>
              </div>

              <div class="d-flex flex-row p-3 align-items-center justify-content-center rounded-2 bg-blue200">
                <div class="col-6 d-flex justify-content-center">
                  <button type="button" class="btn btn-secondary col-9" data-bs-dismiss="modal">Cancelar</button>
                </div>
                <div class="col-6 d-flex justify-content-center">
                  <button type="submit" class="btn bg-primary text-white col-9">Aceptar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importa tus funciones de Firestore desde el nuevo archivo dedicado
import { savePayment, onGetPayments, deletePayment, getPayment, updatePayment } from '@/firebase/paymentsService';
import Swal from 'sweetalert2'; // Para las alertas
import * as XLSX from 'xlsx'; // Para generar Excel
import NavbarComponent from '@/components/NavbarComponent.vue'; // Asegúrate de que esta ruta sea correcta

export default {
  name: 'PaymentsView',
  components: {
    NavbarComponent, // Registrar el componente Navbar
  },
  data() {
    return {
      // Objeto para el formulario de nuevo pago
      newPayment: {
        nombre: '',
        ci: '',
        fecha_pago: '',
        concepto: '',
        forma_pago: '',
        monto: '',
        estado: ''
      },
      payments: [], // Array para almacenar los pagos de Firestore
      editStatus: false, // Para saber si estamos editando o creando
      currentPaymentId: null, // ID del pago que se está editando
      // Objeto para el formulario de edición en el modal
      currentPayment: {
        nombre: '',
        ci: '',
        fecha_pago: '',
        concepto: '',
        forma_pago: '',
        monto: '',
        estado: ''
      }
    };
  },
  async mounted() {
    // Al montar el componente, suscríbete a los cambios en Firestore
    onGetPayments((querySnapshot) => {
      this.payments = []; // Limpia el array antes de llenarlo
      querySnapshot.forEach((doc) => {
        this.payments.push({
          id: doc.id, // Agrega el ID del documento
          ...doc.data() // Spreads el resto de los datos
        });
      });
    });
  },
  methods: {
    // Método para guardar un nuevo pago
    async saveNewPayment() {
      if (!this.editStatus) { // Si no estamos editando, guardar como nuevo
        try {
          await savePayment(
            this.newPayment.nombre,
            this.newPayment.ci,
            this.newPayment.fecha_pago,
            this.newPayment.concepto,
            this.newPayment.forma_pago,
            this.newPayment.monto,
            this.newPayment.estado
          );
          await Swal.fire({
            icon: 'success',
            title: 'Pago registrado exitosamente',
            confirmButtonText: 'Aceptar'
          });
          this.resetForm(); // Limpiar el formulario
        } catch (error) {
          console.error("Error al registrar pago:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: 'No se pudo registrar el pago. Inténtalo de nuevo.'
          });
        }
      } else { // Si estamos editando, actualizar el pago existente
        // Aunque el botón de "Registrar" no debería activarse en modo edición,
        // si lo has configurado así, esta parte se encargaría de ello.
        // Normalmente, el botón de "Registrar" solo registra, y el de "Actualizar" solo actualiza.
        // Revisa la lógica si esto es un doble propósito.
        await this.updateExistingPayment();
      }
    },

    // Método para eliminar un pago
    async deletePaymentById(id) {
      try {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminarlo!',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          await deletePayment(id);
          Swal.fire(
            '¡Eliminado!',
            'El pago ha sido eliminado.',
            'success'
          );
        }
      } catch (error) {
        console.error("Error al eliminar pago:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: 'No se pudo eliminar el pago. Inténtalo de nuevo.'
        });
      }
    },

    // Método para cargar datos de pago en el modal de edición
    async editPayment(id) {
      this.currentPaymentId = id;
      this.editStatus = true; // Establecer estado de edición
      try {
        const doc = await getPayment(id);
        const paymentData = doc.data();
        // Cargar los datos al objeto currentPayment para bindeo del modal
        this.currentPayment.nombre = paymentData.nombre;
        this.currentPayment.ci = paymentData.ci;
        this.currentPayment.fecha_pago = paymentData.fecha_pago;
        this.currentPayment.concepto = paymentData.concepto;
        this.currentPayment.forma_pago = paymentData.forma_pago;
        this.currentPayment.monto = paymentData.monto;
        this.currentPayment.estado = paymentData.estado;
      } catch (error) {
        console.error("Error al cargar pago para edición:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: 'No se pudo cargar los datos del pago para edición.'
        });
      }
    },

    // Método para actualizar el pago existente (llamado desde el modal)
    async updateExistingPayment() {
      try {
        await updatePayment(this.currentPaymentId, {
          nombre: this.currentPayment.nombre,
          ci: this.currentPayment.ci,
          fecha_pago: this.currentPayment.fecha_pago,
          concepto: this.currentPayment.concepto,
          forma_pago: this.currentPayment.forma_pago,
          monto: this.currentPayment.monto,
          estado: this.currentPayment.estado
        });

        // Cierra el modal de Bootstrap
        const modalElement = document.getElementById('staticBackdrop');
        if (modalElement && window.bootstrap) {
          const modal = window.bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }

        // Muestra SweetAlert2 después de cerrar el modal
        await Swal.fire({
          icon: 'success',
          title: 'Datos actualizados exitosamente',
          confirmButtonText: 'Aceptar'
        });

        this.resetForm(); // Limpiar el formulario principal y el estado de edición
      } catch (error) {
        console.error("Error al actualizar pago:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error de actualización',
          text: 'No se pudo actualizar el pago. Inténtalo de nuevo.'
        });
      }
    },

    // Método para limpiar el formulario de nuevo pago y resetear estado de edición
    resetForm() {
      this.newPayment = {
        nombre: '',
        ci: '',
        fecha_pago: '',
        concepto: '',
        forma_pago: '',
        monto: '',
        estado: ''
      };
      this.editStatus = false;
      this.currentPaymentId = null;
      this.currentPayment = { // También limpia el objeto del modal
        nombre: '',
        ci: '',
        fecha_pago: '',
        concepto: '',
        forma_pago: '',
        monto: '',
        estado: ''
      };
    },

    // Método para generar el archivo Excel
    generateExcel() {
      const data = [
        ["Nombre completo", "Cedula", "Fecha de pago", "Concepto", "Forma de pago", "Monto", "Estado"],
        ...this.payments.map(payment => [
          payment.nombre,
          payment.ci,
          payment.fecha_pago,
          payment.concepto,
          payment.forma_pago,
          payment.monto,
          payment.estado
        ])
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Pagos"); // Changed sheet name
      XLSX.writeFile(wb, "pagos_gymtrack.xlsx"); // Changed filename
      Swal.fire({
        icon: 'success',
        title: 'Excel generado',
        text: 'El archivo de pagos ha sido descargado.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import '../css/payments.css'; // Asegúrate de que esta ruta sea correcta para estilos específicos de pagos

// Si colors.css y font.css son globales (importados en main.js), no deberían estar aquí.
// @import '../css/colors.css';
// @import '../css/font.css';
// @import '../css/home.css'; // Home.css probablemente no es específico de pagos, mejor global.

.btn-save {
  border: none;
}

.btnEditStyle {
  color: white;
}
</style>