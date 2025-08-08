<script>
  import { onMount } from "svelte";
  import Swal from "sweetalert2";
  import { fetchWithAuth } from '../api/auth'; // Verifica que la ruta sea correcta

  export let id;

  let nombres = "";
  let apellidos = "";
  let email = "";
  let rol = "";
  let password = "";
  let tipo_identificacion = "";
  let identificacion = "";
  let telefono = "";
  let direccion = "";
  let barrio = "";
  let ciudad = "";

  onMount(async () => {
      try {

        // Si hay un id, obtener detalles del producto (ya como JSON)
        if (id) {
          const user = await fetchWithAuth(`http://127.0.0.1:5000/api/admin/usuarios/${id}`);
          if (user) {

            nombres = user.nombres || "";
            apellidos = user.apellidos || "";
            email = user.email || "";
            rol = user.rol || "";
            password = user.password || "";
            tipo_identificacion = user.tipo_identificacion || "";
            identificacion = user.identificacion || "";
            telefono = user.telefono || "";
            direccion = user.direccion || "";
            barrio = user.barrio || "";
            ciudad = user.ciudad || "";
            
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });

    const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      nombres,
      apellidos,
      email,
      rol,
      password,
      tipo_identificacion,
      identificacion,
      telefono,
      direccion,
      barrio,
      ciudad
    };

    try {
      const method = id ? "PATCH" : "POST";
      const url = id ? `http://127.0.0.1:5000/api/admin/usuarios/${id}` : "http://127.0.0.1:5000/api/admin/usuarios/";

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData),
      });

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Usuario guardado correctamente',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        window.location.href = '/usuarios';
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar el usuario',
      });
    }
  };
</script>

<main class="row m-0">
  <div class="col-12 col-md-8 mx-auto pt-3 mb-4 mb-md-0">
    <form on:submit={handleSubmit}>
      <div class="card p-3">
        <h3 class="text-center">{id ? "Editar usuario" : "Guardar usuario"}</h3>
        <div class="row">
          <div class="col-12 col-md-6">
              <label for="nombres" class="form-label">Nombres</label>
              <div class="input-group input-group-outline mb-2 mt-n2">
                  <input type="text" id="nombres" class="form-control" bind:value={nombres} required>
              </div>
          </div>

          <div class="col-12 col-md-6">
              <label for="apellidos" class="form-label">Apellidos</label>
              <div class="input-group input-group-outline mb-2 mt-n2">
                  <input type="text" id="apellidos" class="form-control" bind:value={apellidos} required>
              </div>
          </div>
          
          <div class="col-12 col-md-5">
              <label for="email" class="form-label">Correo</label>
              <div class="input-group input-group-outline mb-2 mt-n2">
                  <input type="email" id="email" class="form-control" bind:value={email} required>
              </div>
          </div>

          <div class="col-5 col-md-2">
            <label for="tipo_identificacion" class="form-label">Rol</label>
            <div class="input-group input-group-outline mb-3 mt-n2">
                <select id="tipo_identificacion" class="form-control" bind:value={rol} required>
                    <option value="" disabled selected>Seleccionar</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="MOD">Moderador</option>
                    <option value="CLIENTE">Cliente</option>
                    <!-- Agrega más opciones según sea necesario -->
                </select>
            </div>
        </div>

          <div class="col-12 col-md-5">
              <label for="password" class="form-label">Contraseña</label>
              <div class="input-group input-group-outline mb-3 mt-n2">
                  <input type="password" id="password" class="form-control" bind:value={password}>
              </div>
          </div>

          <div class="col-5 col-md-4">
              <label for="tipo_identificacion" class="form-label">Tipo ident.</label>
              <div class="input-group input-group-outline mb-3 mt-n2">
                  <select id="tipo_identificacion" class="form-control" bind:value={tipo_identificacion} required>
                      <option value="" disabled selected>Seleccionar</option>
                      <option value="CC">CC</option>
                      <option value="TI">TI</option>
                      <!-- Agrega más opciones según sea necesario -->
                  </select>
              </div>
          </div>

          <div class="col-7 col-md-8">
              <label for="identificacion" class="form-label">Numero ident.</label>
              <div class="input-group input-group-outline mb-2 mt-n2">
                  <input type="text" id="identificacion" class="form-control" bind:value={identificacion} required>
              </div>
          </div>

          <div class="col-12 col-md-5">
              <label for="telefono" class="form-label">Teléfono</label>
              <div class="input-group input-group-outline mb-2 mt-n2">
                  <input type="text" id="telefono" class="form-control" bind:value={telefono} required>
              </div>
          </div>

          <div class="col-12 col-md-7">
              <label for="direccion" class="form-label">Dirección</label>
              <div class="input-group input-group-outline mb-2 mt-n2">
                  <input type="text" id="direccion" class="form-control" bind:value={direccion} required>
              </div>
          </div>
          
          <div class="col-12 col-md-6">
              <label for="barrio" class="form-label">Barrio</label>
              <div class="input-group input-group-outline mb-2 mt-n2">
                  <input type="text" id="barrio" class="form-control" bind:value={barrio} required>
              </div>
          </div>

          <div class="col-12 col-md-6">
              <label for="ciudad" class="form-label">Ciudad</label>
              <div class="input-group input-group-outline mb-2 mt-n2">
                  <input type="text" id="ciudad" class="form-control" bind:value={ciudad} required>
              </div>
          </div>
          <div class="col-12 text-center">
            <a href="/usuarios" class="btn btn-danger">Cancelar</a>
            <button class="btn btn-success" type="submit">Guardar</button>
          </div>
      </div>
      </div>
    </form>
  </div>
</main>

<style>
  /* Estilo personalizado si es necesario */
</style>
