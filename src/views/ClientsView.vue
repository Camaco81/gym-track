<template>
  <div id="contenido-protegido">
    <NavbarComponent/>
    <h1 class="text-blue700 fw-semibold">Clientes</h1>
    <main class="d-flex flex-column justify-content-center align-items-center">
      <form @submit.prevent="saveNewClient" class="d-flex flex-column col-11 col-md-8 mb-4 p-4">
        <label class="text-blue700 fw-semibold" for="nombre_completo">Nombre completo</label>
        <input placeholder="Ingresa nombre completo" class="mb-2 p-2 rounded-3 border border-muted" required
          id="nombre_completo" type="text" v-model="newClient.nombre">

        <label class="text-blue700 fw-semibold" for="cedula">Cedula</label>
        <input placeholder="Ingresa cedula" class="mb-2 p-2 rounded-3 border border-muted" required id="cedula"
          type="text" v-model="newClient.ci">

        <label class="text-blue700 fw-semibold" for="fecha_rutina">Fecha de inicio de rutina</label>
        <input class="mb-2 p-2 rounded-3 border border-muted" required id="fecha_rutina" type="date"
          v-model="newClient.fecha">

        <label class="text-blue700 fw-semibold" for="horario">Horario</label>
        <input required id="horario" type="time" v-model="newClient.horario">

        <label class="text-blue700 fw-semibold mt-2" for="rutina_actual">Rutina actual</label>
        <input placeholder="Ingresa rutina actual" class="mb-2 p-2 rounded-3 border border-muted" required
          id="rutina_actual" type="text" v-model="newClient.rutinActual">

        <button type="submit" class="btn-save bg-blue700 text-white rounded-3 border-none p-2 mt-3">
          {{ editStatus ? 'Actualizar Cliente' : 'Registrar Cliente' }}
        </button>
      </form>
    </main>

    <div class="table-responsive rounded-3 p-2 mx-2">
      <table class="table rounded-3" id="miTabla">
        <thead>
          <tr>
            <th class="text-blue700" scope="col">Nombre completo</th>
            <th class="text-blue700" scope="col">Cedula</th>
            <th class="text-blue700" scope="col">Fecha de inicio de rutina</th>
            <th class="text-blue700" scope="col">Horario</th>
            <th class="text-blue700" scope="col">Rutina actual</th>
            <th class="text-blue700" scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id">
            <td>{{ client.nombre }}</td>
            <td>{{ client.ci }}</td>
            <td>{{ client.fecha }}</td>
            <td>{{ client.horario }}</td>
            <td>{{ client.rutinActual }}</td>
            <td scope="row">
              <button class="mb-1 btn btn-danger btn-delete" @click="deleteClientById(client.id)">
                <i class="bi bi-trash3-fill m-1"></i>
              </button>
              <button class="mb-1 btn btn-succes bg-blue700 btn-edit" @click="editClient(client.id)"
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
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Editar de cliente</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body bg-blue200">
            <form @submit.prevent="updateExistingClient" id="clientEditForm" class="d-flex flex-column grid gap-2">
              <div>
                <label for="edit_nombre_completo" class="fw-semibold">Nombre completo</label>
                <input placeholder="Ingresa nombre completo" type="text" class="rounded-2 p-1 col-11"
                  id="edit_nombre_completo" v-model="currentClient.nombre">
              </div>

              <div class="d-flex grid gap-1">
                <div class="col-6 d-flex flex-column">
                  <label for="edit_cedula" class="fw-semibold">Cedula</label>
                  <input placeholder=" Ingresa cedula" type="text" class="rounded-2 p-1 col-11" id="edit_cedula"
                    v-model="currentClient.ci">
                </div>

                <div class="col-6 d-flex flex-column">
                  <label for="edit_fecha_rutina" class="fw-semibold">Fecha de inicio de rutina</label>
                  <input type="date" class="rounded-2 p-1 col-11" id="edit_fecha_rutina" v-model="currentClient.fecha">
                </div>
              </div>

              <div class="d-flex grid gap-1">
                <div class="col-6 d-flex flex-column">
                  <label for="edit_horario" class="fw-semibold">Horario</label>
                  <input type="time" class="rounded-2 p-1 col-11 mb-2" id="edit_horario" v-model="currentClient.horario">
                </div>

                <div class="col-6 d-flex flex-column">
                  <label for="edit_rutina_actual" class="fw-semibold">Rutina actual</label>
                  <input placeholder="Ingresa rutina actual" type="text" class="rounded-2 p-1 col-11"
                    id="edit_rutina_actual" v-model="currentClient.rutinActual">
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
import { saveClient, ongetClient, deleteClient, getClient, updateClient } from '@/firebase/clientService';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import NavbarComponent from '@/components/NavbarComponent.vue';

export default {
  name: 'ClientsView',
  components: {
    NavbarComponent
  },
  data() {
    return {
      newClient: {
        nombre: '',
        ci: '',
        fecha: '',
        horario: '',
        rutinActual: ''
      },
      clients: [],
      editStatus: false,
      currentClientId: null,
      currentClient: {
        nombre: '',
        ci: '',
        fecha: '',
        horario: '',
        rutinActual: ''
      }
    };
  },
  async mounted() {
    ongetClient((querySnapshot) => {
      this.clients = [];
      querySnapshot.forEach((doc) => {
        this.clients.push({
          id: doc.id,
          ...doc.data()
        });
      });
    });
  },
  methods: {
    async saveNewClient() {
      if (!this.editStatus) {
        try {
          await saveClient(
            this.newClient.nombre,
            this.newClient.ci,
            this.newClient.fecha,
            this.newClient.horario,
            this.newClient.rutinActual
          );
          await Swal.fire({ // Usar await aquí para esperar el cierre de la alerta
            icon: 'success',
            title: 'Cliente registrado exitosamente',
            confirmButtonText: 'Aceptar'
          });
          this.resetForm();
        } catch (error) {
          console.error("Error al registrar cliente:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: 'No se pudo registrar el cliente. Inténtalo de nuevo.'
          });
        }
      } else {
        await this.updateExistingClient();
      }
    },

    async deleteClientById(id) {
      try {
        const result = await Swal.fire({ // Usar await para esperar la respuesta del usuario
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
          await deleteClient(id);
          Swal.fire(
            '¡Eliminado!',
            'El cliente ha sido eliminado.',
            'success'
          );
        }
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: 'No se pudo eliminar el cliente. Inténtalo de nuevo.'
        });
      }
    },

    async editClient(id) {
      this.currentClientId = id;
      this.editStatus = true;
      try {
        const doc = await getClient(id);
        const clientData = doc.data();
        this.currentClient.nombre = clientData.nombre;
        this.currentClient.ci = clientData.ci;
        this.currentClient.fecha = clientData.fecha;
        this.currentClient.horario = clientData.horario;
        this.currentClient.rutinActual = clientData.rutinActual;
      } catch (error) {
        console.error("Error al cargar cliente para edición:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: 'No se pudo cargar los datos del cliente para edición.'
        });
      }
    },

    async updateExistingClient() {
      try {
        await updateClient(this.currentClientId, {
          nombre: this.currentClient.nombre,
          ci: this.currentClient.ci,
          fecha: this.currentClient.fecha,
          horario: this.currentClient.horario,
          rutinActual: this.currentClient.rutinActual
        });

        // Primero cierra el modal de Bootstrap
        const modalElement = document.getElementById('staticBackdrop');
        if (modalElement && window.bootstrap) {
          const modal = window.bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }

        // Luego muestra la alerta de SweetAlert2 y espera su interacción
        await Swal.fire({
          icon: 'success',
          title: 'Datos actualizados exitosamente',
          confirmButtonText: 'Aceptar'
        });

        this.resetForm();
      } catch (error) {
        console.error("Error al actualizar cliente:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error de actualización',
          text: 'No se pudo actualizar el cliente. Inténtalo de nuevo.'
        });
      }
    },

    resetForm() {
      this.newClient = {
        nombre: '',
        ci: '',
        fecha: '',
        horario: '',
        rutinActual: ''
      };
      this.editStatus = false;
      this.currentClientId = null;
      this.currentClient = {
        nombre: '',
        ci: '',
        fecha: '',
        horario: '',
        rutinActual: ''
      };
    },

    generateExcel() {
      const data = [
        ["Nombre completo", "Cedula", "Fecha de inicio de rutina", "Horario", "Rutina actual"],
        ...this.clients.map(client => [
          client.nombre,
          client.ci,
          client.fecha,
          client.horario,
          client.rutinActual
        ])
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Clientes");
      XLSX.writeFile(wb, "clientes_gymtrack.xlsx");
      Swal.fire({
        icon: 'success',
        title: 'Excel generado',
        text: 'El archivo de clientes ha sido descargado.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import '../css/client.css';
@import '../css/colors.css';
@import '../css/font.css';





.btn-save {
  border: none;
}

.btnEditStyle {
  color: white;
}
</style>