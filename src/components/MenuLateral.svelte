<script>
    import { onMount } from "svelte";
    import { currentPath, updatePath } from '../stores/menu.js';
    import { fetchUserProfile } from '../api/user.js';
    import { user } from '../stores/user.js'; // Store para guardar los datos del usuario
    import { getPedidosPendientes } from '../api/pedidoAdmin.js'; // Importa la función de la API

    // Variable para almacenar el número de pedidos pendientes
    let pedidosPendientes = 0;
    let errorMessage = ''; // Para manejar errores

    let userProfile = {};

    
    // Llamar a la función de usuarios al montar el componente
    onMount(async () => {
        try {
            userProfile = await fetchUserProfile();
            user.set(userProfile); // Guardar los datos en el store
        } catch (error) {
            console.error('No se pudo obtener el perfil del usuario:', error);
        }

        // INICIO DE PROTECCION DE RUTA🛡️
        // REQUISITOS let userProfile = {}; E IMPORTAR {fetchUserProfile}
        // Verifica que userProfile esté definido antes de acceder a sus propiedades
        if (userProfile && userProfile.nombres) {
            if (userProfile.rol === "ADMIN") {
                console.log("Acceso concedido a ADMIN"); // si es admin no redirige 
            } else {
                console.log("Redirigiendo a la ruta principal");
                window.location.href = '/'; // no es admin redirige a home
            }
        } else {
            console.log("Perfil de usuario no disponible");
            window.location.href = '/'; // Redirigir si no hay perfil
        }
        // FIN DE PROTECCION DE RUTA🛡️

        //PEDIDOS PENDIENTES
        try {
          pedidosPendientes = await getPedidosPendientes(); // Llama a la función externa
        } catch (error) {
          errorMessage = error.message;
        }
    });

    // condiciones del menu segun la pagia en que se encuentra
    function isActive(path) { return $currentPath === path ? 'bg-select' : 'mx-auto';}

    function selector(path) {return $currentPath === path ? 'selector' : 'no-selector';}

    function linkSelect(path) {return $currentPath === path ? 'card-select' : 'none';}

</script>

<!-- <div class="row m-0"> -->
<!-- Pequisistos: tener un row con m-0 y llamar este componente dentro -->
 <!-- Poner style="margin-left: 4.5rem;" al contenido de la derecha -->
<div class="">
  <div id="sidebar" class="d-flex flex-column" style="background-color: #1b1b1b;">
      <a href="/" class="border-bottom text-center mt-2 mb-1 pb-1">
          <img class="mb-n1" src="/img/logo.svg" alt="imglogo" style="width: 30px;">
          <span class="text-white">Vitrina</span>
      </a>
      <a class="my-1 p-1 text-center card-menu mx-2 {linkSelect('/administrador')}" href="/administrador" on:click={() => updatePath('/administrador')}>
          <span class="material-symbols-outlined simbolo-icon {isActive('/administrador')}">home_app_logo</span>
          <p class="pt-1 text-white text-menu">Home</p>
          <span class="{selector('/administrador')}"></span>
      </a>
      <a class="my-1 p-1 text-center card-menu mx-2 {linkSelect('/productos')}" href="/productos" on:click={() => updatePath('/productos')}>
          <span class="material-symbols-outlined simbolo-icon {isActive('/productos')}">inventory</span>
          <p class="pt-1 text-white text-menu">Productos</p>
          <span class="{selector('/productos')}"></span>
      </a>
      <a class="my-1 p-1 text-center card-menu mx-2 {linkSelect('/categorias')}" href="/categorias" on:click={() => updatePath('/categorias')}>
          <span class="material-symbols-outlined simbolo-icon {isActive('/categorias')}">category</span>
          <p class="pt-1 text-white text-menu">Categorias</p>
          <span class="{selector('/categorias')}"></span>
      </a>
      <a class="my-1 p-1 text-center card-menu mx-2 {linkSelect('/pedidos_admin')}" href="/pedidos_admin" on:click={() => updatePath('/pedidos_admin')}>
          <span class="material-symbols-outlined simbolo-icon {isActive('/pedidos_admin')}">contract</span>
          <p class="pt-1 text-white text-menu">Pedidos</p>
          <span class="globo-pedidos">{pedidosPendientes}</span>
          <span class="{selector('/pedidos_admin')}"></span>
      </a>
      <a class="my-1 p-1 text-center card-menu mx-2 {linkSelect('/usuarios')}" href="/usuarios" on:click={() => updatePath('/usuarios')}>
          <span class="material-symbols-outlined simbolo-icon {isActive('/usuarios')}">group</span>
          <p class="pt-1 text-white text-menu">Usuarios</p>
          <span class="{selector('/usuarios')}"></span>
      </a>
      <a class="my-1 p-1 text-center card-menu mx-2 {linkSelect('/vista_salidas')}" href="/vista_salidas" on:click={() => updatePath('/vista_salidas')}>
        <span class="material-symbols-outlined simbolo-icon {isActive('/vista_salidas')}">logout</span>
        <p class="pt-1 text-white text-menu">Salidas</p>
        <span class="{selector('/vista_salidas')}"></span>
      </a>
      <a class="my-1 p-1 text-center card-menu mx-2 {linkSelect('/vista_entradas')}" href="/vista_entradas" on:click={() => updatePath('/vista_entradas')}>
        <span class="material-symbols-outlined simbolo-icon {isActive('/vista_entradas')}">login</span>
        <p class="pt-1 text-white text-menu">Entradas</p>
        <span class="{selector('/vista_entradas')}"></span>
      </a>

      <a class="my-1 p-1 text-center card-menu mx-2 {linkSelect('/ajustes')} mt-auto" href="/ajustes" on:click={() => updatePath('/')}>
          <span class="material-symbols-outlined simbolo-icon {isActive('/ajustes')}">settings</span>
          <p class="pt-1 text-white text-menu">Ajustes</p>
          <span class="{selector('/ajustes')}"></span>
      </a>
        <hr class="text-white bg-white mx-2 my-0">
        <!-- Botón Dropdown en el fondo -->
        <a class="my-1 p-1 text-center py-2 card-menu mx-2" href="/cuenta">
            <span class="material-symbols-outlined">shield_person</span>
            <p class="pt-1 text-white text-menu">{userProfile.nombres}</p>
        </a>
  </div>
</div>

<style>
  /* Estilos para el menú lateral */
  #sidebar {
      width: 4.5rem;
      height: 100%; /* Altura completa de la ventana */
      position: fixed; /* Fijo en la página */
      top: 0;
      left: 0;
      z-index: 998;
      
  }

  .text-menu{
    font-size: 61%;
    margin-top: -14px;
    margin-bottom: 0px;
  }

  .simbolo-icon{
    font-size: 26px;
  }

  .card-menu{
    position: relative;
    color: white;
    border-radius: 0.30rem;
    text-align: center;
  }

  .card-menu:hover {
    transition: color 100ms ease-out 100ms;
    background: #2d2d2d;
  }

  .card-select{
    background-color: #2d2d2d;    
    border: 1px solid transparent; /* Empieza sin borde */
    /* Animación */
    animation: borderLoading 1s linear forwards;
  }

  .selector{
    width: 4px;
    height: 50%;
    border-radius: 20px;
    background-color: #39a900;
    position: absolute;
    left: -6.8px;
    top: 12px;

    /* Inicialmente, está en escala pequeña */
    transform: scale(0);
    /* Aplicar la animación */
    animation: growAnimation 600ms forwards;

  }

    /* Definimos la animación */
    @keyframes growAnimation {
        from {
        transform: scale(0);
        }
        to {
        transform: scale(1);
        }
    }
    /* Animación del borde */
    @keyframes borderLoading {
        0% {
        border-color: transparent; /* Comienza sin borde visible */
        }
        20% {
        border-color: green; /* Al final del efecto, el borde es verde */
        }
    }

  .no-selector{
    display: none;
  }
    
    .bg-select{
        color: #38a900;
    }

    .globo-pedidos{
      position: absolute;
      width: 19px;
      height: 19px;
      border-radius: 50%;
      top: -2px;
      right: -4px;
      font-size: 11px;
      background: #38a900;
      color: #fff;
      border: 1px solid #38a900;
      font-weight: bold;

    }

</style>
