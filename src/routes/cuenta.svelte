<script>
  import { link } from 'svelte-routing';
  import { fetchUserProfile } from '../api/user';
  import { user } from '../stores/user'; // Store para guardar los datos del usuario
  import { onMount } from 'svelte';
  import Menufooter from '../components/menufooter.svelte';
  import Nav from '../components/nav.svelte';
  import { logout } from '../api/auth';
  import Swal from 'sweetalert2';

  // cerrar sesion
  function handleLogout() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Serás desconectado de tu sesión actual.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Ejecuta la función logout si el usuario confirma
            logout();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '¡Sesión cerrada!',
                text: 'Has cerrado sesión correctamente.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}



  let userProfile = {};

  // Llamar a la función al montar el componente
  onMount(async () => {
      try {
          userProfile = await fetchUserProfile();
          user.set(userProfile); // Guardar los datos en el store
      } catch (error) {
          console.error('No se pudo obtener el perfil del usuario:', error);
      }
  });

</script>

<main>

  <Nav/>
  <header class="bg-gradient-dark mt-n3">
    <div class="page-header min-vh-35" style="background-image: url(&quot;/img/img-sena/sena2.jpeg&quot;); background-position-y: 60%; background-size: cover; background-position-x: 70%;">
      <span class="mask bg-gradient-dark opacity-8"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-6">

            <h5 class="mb-n5 text-white ">
              Hola, {userProfile.nombres}
            </h5>


          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="container" style="min-height: 57vh;">
    <div class="col-12 col-md-6 mx-auto">

      <div class="card mt-n5">
           
        <a class="border-radius-2xl botones px-2 cursor-pointer mb-0" use:link href="/perfil">
          <div class="container border-bottom px-3">
            <div class="row">
              <div class="col-auto p-0 ps-3 pt-3 pb-1">
                <span class="material-symbols-outlined opacity-6 me-1 text-xl">person</span>
                </div>
                  <span class="col pt-3">Mi perfil</span>
            </div>
          </div>
        </a>

        <a class="border-radius-2xl botones px-2 cursor-pointer mb-0" use:link href="/mis_pedidos">
          <div class="container border-bottom px-3">
            <div class="row">
              <div class="col-auto p-0 ps-3 pt-3 pb-1">
                <span class="material-symbols-outlined opacity-6 me-1 text-xl">shopping_bag</span>
                </div>
                  <span class="col pt-3">Mis pedidos</span>
            </div>
          </div>
        </a>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="border-radius-2xl botones px-2 cursor-pointer mb-0" on:click={handleLogout}>
          <div class="container border-bottom px-3">
            <div class="row">
              <div class="col-auto p-0 ps-3 pt-3 pb-1">
                <span class="material-symbols-outlined opacity-6 me-1 text-danger text-xl">logout</span>
                </div>
                  <span class="col pt-3 text-danger">Cerrar sesion</span>
            </div>
          </div>
        </div>
      </div>

    </div>
      
  </div>

  <Menufooter/>
</main>

<style>
  .botones:hover{
    background-color: #f0f2f5;
    color: black; }
</style>

