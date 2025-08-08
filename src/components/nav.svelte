<script>
	import Car from './ModalCarrito.svelte';

  import { Router, Route, link } from 'svelte-routing';
  import { fetchUserProfile } from '../api/user';
  import { user } from '../stores/user'; // Store para guardar los datos del usuario
  import { onMount } from 'svelte';
  import { productCount } from '../stores/cart.js';
  import Swal from 'sweetalert2';


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

  // modal carrito
  import { isModalOpen } from '../stores/modalStore.js';

  function openModal() {
    isModalOpen.set(true);
  }

  // modal Search
    import ModalSearch from '../components/ModalSearch.svelte';
    import { isModalOpenSearch } from '../stores/modalStore';

    function openModalSearch() {
        isModalOpenSearch.set(true); // Abre el modal
        
    }

  import { logout } from '../api/auth';
    import Search from './Search.svelte';

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

</script>

<Car/>
<ModalSearch/>

<div class="position-sticky mobile-menu z-index-sticky mb-6 top-0 d-none d-md-block">
  <div class="row">
    <div class="col-12">
      <nav class="navbar navbar-expand-lg top-0 z-index-fixed blur py-0 shadow position-absolute py-0 start-0 end-0">
        <div class="container-fluid px-0">
          <a class="col-9 col-sm-7 col-md-5 col-lg-4 col-xl-4 col-xxl-3 font-weight-bolder " use:link href="/" rel="tooltip" data-placement="bottom">
            <div class="row">
              <div class="col-3 text-end">
                <img class="my-2" src="/img/logo.svg" alt="o" style="width: 30px;">
              </div>
              <p class="col-9 border-start border-2 text-dark my-auto font-weight-bold">SENA Empresa vitrina web</p>
            </div>
            
          </a>
          
          <div class="mb-0 ms-auto">
            <Search/>
          </div>
          <div class="mb-0 ms-3 pt-3">
            <button class="btn-sm btn btn-outline-success border-0 mb-0 p-0 mt-n4 pe-1" on:click={openModal} style="border-radius: 0;">
              <svg class="my-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105.96 98.45" style="width: 31px;">
                <defs>
                  <style>
                    .cls-1 {font-family: MSReferenceSansSerif, 'MS Reference Sans Serif';font-size: 33px;}
              
                    .cls-2 {fill: #38a900a8;}
              
                    .globo-car {fill: #38a900a8;stroke: #38a900a8;stroke-miterlimit: 10;stroke-width: 4px;text-align: center;}
              
                    .cls-4 {fill: #38a900a8;}

                    .globo-text{
                      fill: #fff;
                    }
                  </style>
                </defs>
                <g>
                  <path class="cls-4" d="M59.28,34.41c6.49,0,12.98-.04,19.47.01,6.25.05,7.49,1.57,6.12,7.45-1.66,7.11-3.29,14.23-5.09,21.31-2.15,8.49-7.02,12.28-15.62,12.32-9.82.04-19.65-.3-29.45.1-10.13.41-14.97-5.45-16.78-13.56-1.95-8.75-4.18-17.44-5.84-26.25-.66-3.49-1.78-5.03-5.44-4.49-3.42.51-6.79,0-6.65-4.43.12-3.98,3.38-4.35,6.57-4.37,11.81-.06,11.76-.06,14.21,11.37,1.94,9.09,4.11,18.13,6.02,27.23.89,4.25,3.13,6.24,7.59,6.17,9.82-.15,19.64-.13,29.45,0,4.17.06,6.51-1.61,7.38-5.74,1.03-4.87,2.1-9.76,3.62-14.49,1.22-3.79-.39-4.12-3.47-4.06-9.32.18-18.63.18-27.95.22-2.16.01-4.33.03-6.48-.13-2.88-.22-4.61-1.56-4.42-4.78.19-3.15,2.3-3.82,4.79-3.84,7.32-.07,14.64-.03,21.97-.03v-.02Z"/>
                  <path class="cls-2" d="M62.23,81.58c4.5-.07,8.48,4.01,8.48,8.69,0,4.44-3.7,8.09-8.28,8.18-4.55.09-8.4-3.5-8.5-7.93-.1-4.62,3.84-8.87,8.29-8.94Z"/>
                  <path class="cls-4" d="M32.24,82.37c4.1.13,7.62,4.07,7.53,8.42-.09,4.53-3.86,7.85-8.68,7.63-4.47-.2-7.67-3.73-7.48-8.23.2-4.55,3.96-7.97,8.62-7.82Z"/>
                  {#if $productCount > 0}
                    <circle class="globo-car" cx="78.45" cy="27.51" r="24.51"/>
                    <text class="cls-1" transform="translate(63.32 35.83)"><tspan class="globo-text" x="{$productCount < 10 ? "5" : "-6"}" y="3">{$productCount}</tspan></text>
                  {/if}
                </g>
              </svg>
            </button>
          </div>

          {#if userProfile && userProfile.nombres}

            {#if userProfile.rol === "ADMIN"}
            <div class="mb-0">
              <div class="nav-item dropdown  ms-2">
                <a role="button" class=" btn btn-sm btn-blue mb-0" id="dropdownMenuDocs" data-bs-toggle="dropdown" aria-expanded="false">
                  <img class="icon opacity-9 mt-n1" src="/img/icon/admin.svg" alt="icon" width="20px">
                  {userProfile.nombres.split(' ').slice(0, 1).join(' ')}
                </a>
                <div class="dropdown-menu dropdown-menu-end dropdown-menu-animation mt-0  p-3 border-radius-lg" aria-labelledby="dropdownMenuDocs">
                    <ul class="list-group">

                      <li class="nav-item list-group-item border-0 p-0">
                        <a class="dropdown-item py-2 ps-3 border-radius-md" use:link href="/cuenta">
                          <h6 class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">Cuenta</h6>
                        </a>
                      </li>
                      
                      <li class="nav-item list-group-item border-0 p-0">
                        <a class="dropdown-item py-2 ps-3 border-radius-md" use:link href="/administrador">
                          <h6 class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">Administrar</h6>
                        </a>
                      </li>
                      <li class="nav-item list-group-item border-0 p-0">
                        <button class="dropdown-item py-2 ps-3 border-radius-md bg-danger" on:click={handleLogout}>
                          <h6 class="dropdown-header text-white font-weight-bolder d-flex justify-content-cente align-items-center p-0">cerrar sesion</h6>
                        </button>
                      </li>
                    </ul>
                </div>
              </div>
            </div>
            {:else if userProfile.rol === "CLIENTE"}
            <div class="mb-0">
              <div class="nav-item dropdown  ms-2">
                <a role="button" class=" btn btn-sm btn-blue mb-0" id="dropdownMenuDocs" data-bs-toggle="dropdown" aria-expanded="false">
                  <img class="icon opacity-9 mt-n1" src="/img/icon/user.svg" alt="icon" width="20px">
                  {userProfile.nombres.split(' ').slice(0, 1).join(' ')}
                </a>
                <div class="dropdown-menu dropdown-menu-end dropdown-menu-animation mt-0  p-3 border-radius-lg" aria-labelledby="dropdownMenuDocs">
                    <ul class="list-group">

                      <li class="nav-item list-group-item border-0 p-0">
                        <a class="dropdown-item py-2 ps-3 border-radius-md" use:link href="/cuenta">
                          <h6 class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">Cuenta</h6>
                        </a>
                      </li>

                      <li class="nav-item list-group-item border-0 p-0">
                        <button class="dropdown-item py-2 ps-3 border-radius-md bg-danger" on:click={handleLogout}>
                          <h6 class="dropdown-header text-white font-weight-bolder d-flex justify-content-cente align-items-center p-0">cerrar sesion</h6>
                        </button>
                      </li>
                    </ul>
                </div>
              </div>
            </div>
            {:else if userProfile.rol === "MOD"}
            <div class="mb-0">
              <div class="nav-item dropdown  ms-2">
                <a role="button" class=" btn btn-sm btn-blue mb-0" id="dropdownMenuDocs" data-bs-toggle="dropdown" aria-expanded="false">
                  <img class="icon opacity-9 mt-n1" src="/img/icon/admin.svg" alt="icon" width="20px">
                  {userProfile.nombres.split(' ').slice(0, 1).join(' ')}
                </a>
                <div class="dropdown-menu dropdown-menu-end dropdown-menu-animation mt-0  p-3 border-radius-lg" aria-labelledby="dropdownMenuDocs">
                    <ul class="list-group">

                      <li class="nav-item list-group-item border-0 p-0">
                        <a class="dropdown-item py-2 ps-3 border-radius-md" use:link href="/cuenta">
                          <h6 class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">Cuenta</h6>
                        </a>
                      </li>
                      
                      <li class="nav-item list-group-item border-0 p-0">
                        <a class="dropdown-item py-2 ps-3 border-radius-md" use:link href="/consultar_pedidos">
                          <h6 class="dropdown-header text-dark font-weight-bolder d-flex justify-content-cente align-items-center p-0">Control de pedidos</h6>
                        </a>
                      </li>
                      <li class="nav-item list-group-item border-0 p-0">
                        <button class="dropdown-item py-2 ps-3 border-radius-md bg-danger" on:click={handleLogout}>
                          <h6 class="dropdown-header text-white font-weight-bolder d-flex justify-content-cente align-items-center p-0">cerrar sesion</h6>
                        </button>
                      </li>
                    </ul>
                </div>
              </div>
            </div>
            {:else}

              <div class="nav-item dropdown dropdown-hover ms-2">
                <a use:link href="/login" class="btn btn-sm btn-blue mb-0">Ingresar</a>
              </div>
            {/if}
            {:else}

            <div class="nav-item dropdown dropdown-hover ms-2">
              <a use:link href="/login" class="btn btn-sm btn-blue mb-0">Ingresar</a>
            </div>
          {/if}


        </div>
      </nav>
    </div>
  </div>
</div>

<div class="position-sticky mobile-menu z-index-sticky mb-6 mt-n1 d-md-none d-block" style="top: -2px;">
  <div class="row">
    <div class="col-12">
      <nav class="navbar navbar-expand-lg top-0 z-index-fixed py-0  position-absolute py-0 start-0 end-0" style="background-color: #2d2d2d;">
        <div class="container-fluid px-0">
          <div class="col font-weight-bolder ">
            <div class="row my-2">

              <div class="col-9 my-auto">
                <div class="row p-0">
                  <div class="col-auto">
                    <img class="mt-n1" src="/img/logo.svg" alt="logo" style="width: 25px;">
                  </div>
    
                  <h6 class="col-7 border-start border-1 text-white my-auto font-weight-bold">Vitrina web</h6>
                </div>
              </div>
              
              
              
              <div class="col-3 text-end">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="material-symbols-outlined text-white pt-1" on:click={openModalSearch}>search</div>
              </div>
            </div>
            
          </div>

        </div>
      </nav>
    </div>
  </div>
</div>



<style>


</style>
