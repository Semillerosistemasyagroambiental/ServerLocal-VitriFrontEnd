<script>
  import Menufooter from "../components/menufooter.svelte";
  import { onMount } from 'svelte';
  import { user } from '../stores/user'; // Store para guardar los datos del usuario
  import Swal from "sweetalert2";
  import { fetchWithAuth } from '../api/auth'; // Verifica que la ruta sea correcta

  let nombres = "";
  let apellidos = "";
  let email = "";
  let password = "";
  let tipo_identificacion = "";
  let identificacion = "";
  let telefono = "";
  let direccion = "";
  let barrio = "";
  let ciudad = "";

  onMount(async () => {
    // Si hay un id, obtener detalles del producto (ya como JSON)
    const user = await fetchWithAuth(`http://127.0.0.1:5000/api/usuarios/perfil`);
    if (user) {

      nombres = user.nombres || "";
      apellidos = user.apellidos || "";
      email = user.email || "";
      password = user.password || "";
      tipo_identificacion = user.tipo_identificacion || "";
      identificacion = user.identificacion || "";
      telefono = user.telefono || "";
      direccion = user.direccion || "";
      barrio = user.barrio || "";
      ciudad = user.ciudad || "";

    }
  });

  // PATCH DE USUARIO
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      nombres,
      apellidos,
      email,
      password,
      tipo_identificacion,
      identificacion,
      telefono,
      direccion,
      barrio,
      ciudad
    };

    try {
      const method = "PATCH";
      const url = "http://127.0.0.1:5000/api/usuarios/perfil";

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData),
      });
      isDisabled = true; // Deshabilita nuevamente los inputs después de guardar
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Usuario Actualizado correctamente',
        showConfirmButton: false,
        timer: 1500
      })

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar el usuario',
      });
    }
  };

  // PATCH DE DIRECCION
  const handleSubmitDireccion = async (event) => {
    event.preventDefault();

    const formData = {
      direccion,
      barrio,
      ciudad
    };

    try {
      const method = "PATCH";
      const url = "http://127.0.0.1:5000/api/usuarios/perfil";

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData),
      });
      isDisabledDireccion = true; // Deshabilita nuevamente los inputs después de guardar
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Usuario Actualizado correctamente',
        showConfirmButton: false,
        timer: 1500
      })

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar el usuario',
      });
    }
  };

  // ------------------------------------------------------
  
  // funciones de usuario

  let isDisabled = true;

  function enableEditing() {
    isDisabled = false;
  }

  function cancelEditing() {
    isDisabled = true;
  }

  // funciones de direccion

  let isDisabledDireccion = true;

  function enableEditingDireccion() {
    isDisabledDireccion = false;
  }

  function cancelEditingDireccion() {
    isDisabledDireccion = true;
  }

</script>

<main>
  <header class="bg-gradient-dark">
    <div class="page-header min-vh-35" style="background-image: url(&quot;/img/img-sena/sena2.jpeg&quot;); background-position-y: 60%; background-size: cover; background-position-x: 70%;">
      <span class="mask bg-gradient-dark opacity-8"></span>
    </div>
  </header>


  <div class="container">

    <div class="row mt-n8">
      
      <div class="col-12">
        <div class="mb-3">
          {#if isDisabled && isDisabledDireccion}
            <a href="/cuenta" class=" btn btn-sm btn-danger mb-0">
              Volver
            </a>
          {/if}
        </div>
        
      </div>

      <div class="col-12 col-md-6 mx-auto mb-3">
        <div class="card p-4">
  
          <form on:submit={handleSubmit}>
            <div class="row">
              <h5 class="col-8">Datos personales</h5>
  
              {#if isDisabled}
                <div class="text-end col cursor-pointer">
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <div class="material-symbols-outlined text-end text-success" on:click={enableEditing}>
                    edit_square
                    </div>
                </div>
              {/if}
  
                <!-- INPUTS -->
  
                <div class="col-12 col-md-6">
                  <div class="input-group input-group-static my-2">
                    <label for="nombre">Nombres</label>
                    <input type="text" bind:value={nombres} class="form-control" required disabled={isDisabled}/>
                  </div>
                </div>
        
                <div class="col-12 col-md-6">
                  <div class="input-group input-group-static my-2">
                    <label for="Apellidos">Apellidos</label>
                    <input type="text" bind:value={apellidos} class="form-control" required disabled={isDisabled}/>
                  </div>
                </div>
        
                <div class="col-12 col-md-6">
                  <div class="input-group input-group-static my-2">
                    <label for="cel">Celular</label>
                    <input type="number" bind:value={telefono} class="form-control" required disabled={isDisabled}/>
                  </div>
                </div>
        
                <div class="col-12 col-md-6">
                  <div class="input-group input-group-static my-2">
                    <label for="correo">Correo</label>
                    <input type="text" bind:value={email} class="form-control" required disabled={isDisabled}/>
                  </div>
                </div>
        
                <!-- <div class="col-12 col-md-6">
                  <div class="input-group input-group-static my-2">
                    <label for="contra">Contraseña</label>
                    <input type="password" bind:value={password} class="form-control" required disabled={isDisabled}/>
                  </div>
                </div> -->
  
                <div class="container text-center mt-4">
                  {#if !isDisabled}
                    <button type="button" class="btn btn-sm btn-danger mb-0" on:click={cancelEditing}>Cancelar</button>
                    <button type="submit" class="btn btn-sm btn-success mb-0">Guardar Cambios</button>
                  {/if}
                </div>
              
            </div>
          </form>
          
        </div>
      </div>
  
      <div class="col-12 col-md-6 mx-auto">
        <div class="card p-4">
  
          <form on:submit={handleSubmitDireccion}>
            <div class="row">
              <h5 class="col-8">Datos de entrega</h5>
  
              {#if isDisabledDireccion}
                <div class="text-end col cursor-pointer">
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <div class="material-symbols-outlined text-end text-success" on:click={enableEditingDireccion}>
                    edit_square
                    </div>
                </div>
              {/if}
  
                <!-- INPUTS -->
  
                <div class="col-12 col-md-6">
                  <div class="input-group input-group-static my-2">
                    <label for="nombre">Dirección</label>
                    <input type="text" bind:value={direccion} class="form-control" required disabled={isDisabledDireccion}/>
                  </div>
                </div>
        
                <div class="col-12 col-md-6">
                  <div class="input-group input-group-static my-2">
                    <label for="Apellidos">Barrio</label>
                    <input type="text" bind:value={barrio} class="form-control" required disabled={isDisabledDireccion}/>
                  </div>
                </div>
        
                <div class="col-12 col-md-6">
                  <div class="input-group input-group-static my-2">
                    <label for="cel">Ciudad</label>
                    <input type="text" bind:value={ciudad} class="form-control" required disabled={isDisabledDireccion}/>
                  </div>
                </div>
  
                <div class="container text-center mt-4">
                  {#if !isDisabledDireccion}
                    <button type="button" class="btn btn-sm btn-danger mb-0" on:click={cancelEditingDireccion}>Cancelar</button>
                    <button type="submit" class="btn btn-sm btn-success mb-0">Guardar Cambios</button>
                  {/if}
                </div>
              
            </div>
          </form>
          
        </div>
      </div>
    </div>
    
  </div>
  
  <Menufooter/>
</main>

