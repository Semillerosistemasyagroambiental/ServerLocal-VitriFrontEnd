<script>
    import { onMount } from "svelte";
    import { currentPath, updatePath } from '../stores/menu.js';
    import { isModalOpen } from '../stores/modalStore.js';
    import { totalProducts, productCount, addToCart } from '../stores/cart.js';
    
    import { Router, Route, link } from 'svelte-routing';
    import { fetchUserProfile } from '../api/user';
    import { user } from '../stores/user'; // Store para guardar los datos del usuario

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

    function openModal() {
        isModalOpen.set(true);
    }

    function handleAddProduct() {
        addToCart({ id: 1, name: 'Producto Ejemplo', price: 100 });
    }

    function isActive(path) {return $currentPath === path ? 'bg-select border-sebas col-10 mx-auto' : 'col-8 mx-auto';}

    function selector(path) {return $currentPath === path ? 'selector' : 'no-selector';}

    function linkSelect(path) {return $currentPath === path ? 'card-select' : 'none';}

</script>


<div class="mt-6">
    <div class="position-fixed bottom-1 d-md-none mb-n1" style="z-index: 999; width: 100%;">
        <div class="container-fluid">
            <div class="row mx-sebas" style="border-radius: 0.60rem;">

                <div class="row ms-0" style="border-radius: 0.60rem; background-color: #1a1a1a; width: 84%;">
                    <a class="col p-1 text-center" href="/" on:click={() => updatePath('/')}>
                        <div class=" mx-auto card-menu {linkSelect('/')}" style="width: 60px;">
                            <span class="material-symbols-outlined {isActive('/')}" style="border-radius: 50%; font-size: 28px;">home_app_logo</span>
                            <p class="m-0 mt-n3 pt-1 text-white" style="font-size: 12px;">Inicio</p>
                            <span class="{selector('/')}"></span>
                        </div>
                        
                    </a>
                    {#if userProfile && userProfile.nombres}
    
                        <!-- ADMIN -->
                        {#if userProfile.rol === "ADMIN"}
                            <a class="col p-1 text-center" href="/cuenta" on:click={() => updatePath('/cuenta')}>
                                <div class=" mx-auto card-menu {linkSelect('/cuenta')}" style="width: 60px;">
                                    <span class="material-symbols-outlined {isActive('/cuenta')}" style=" font-size: 28px;">person</span>
                                    <p class="m-0 mt-n3 pt-1 text-white" style="font-size: 12px;">Cuenta</p>
                                    <span class="{selector('/cuenta')}"></span>
                                </div>
                                
                            </a>
    
                            <a class="col p-1 text-center" href="/administrador" on:click={() => updatePath('/administrador')}>
                                <div class=" mx-auto card-menu {linkSelect('/administrador')}" style="width: 60px;">
                                    <span class="material-symbols-outlined {isActive('/administrador')}" style="font-size: 28px;">settings</span>
                                    <p class="m-0 mt-n3 pt-1 text-white" style="font-size: 12px;">Admin</p>
                                    <span class="{selector('/administrador')}"></span>
                                </div>
                                
                            </a>
    
                            <!-- USUARIO -->
                            {:else if userProfile.rol === "CLIENTE"}
                            <a class="col p-1 text-center" href="/cuenta" on:click={() => updatePath('/cuenta')}>
                                <div class=" mx-auto card-menu {linkSelect('/cuenta')}" style="width: 60px;">
                                    <span class="material-symbols-outlined {isActive('/cuenta')}" style="border-radius: 50%; font-size: 28px;">person</span>
                                    <p class="m-0 mt-n3 pt-1 text-white" style="font-size: 12px;">Cuenta</p>
                                    <span class="{selector('/cuenta')}"></span>
                                </div>
                                
                            </a>
                            {:else if userProfile.rol === "MOD"}
                            <a class="col p-1 text-center" href="/cuenta" on:click={() => updatePath('/cuenta')}>
                                <div class=" mx-auto card-menu {linkSelect('/cuenta')}" style="width: 60px;">
                                    <span class="material-symbols-outlined {isActive('/cuenta')}" style="border-radius: 50%; font-size: 28px;">person</span>
                                    <p class="m-0 mt-n3 pt-1 text-white" style="font-size: 12px;">Cuenta</p>
                                    <span class="{selector('/cuenta')}"></span>
                                </div>
                                
                            </a>
                            <a class="col p-1 text-center" href="/consultar_pedidos" on:click={() => updatePath('/consultar_pedidos')}>
                                <div class=" mx-auto card-menu {linkSelect('/consultar_pedidos')}" style="width: 60px;">
                                    <span class="material-symbols-outlined {isActive('/consultar_pedidos')}" style="border-radius: 50%; font-size: 28px;">contract</span>
                                    <p class="m-0 mt-n3 pt-1 text-white" style="font-size: 12px;">Moderador</p>
                                    <span class="{selector('/consultar_pedidos')}"></span>
                                </div>
                                
                            </a>
                        {/if}
                    {:else}
                

    
                    <a class="col p-1 text-center" href="/login" on:click={() => updatePath('/cuenta')}>
                        <div class="{isActive('/cuenta')}">
                            <div class=" mx-auto card-menu {linkSelect('/cuenta')}" style="width: 60px;">
                                <span class="material-symbols-outlined text-white " style="border-radius: 50%; font-size: 28px;">person</span>
                                <p class="m-0 mt-n3 pt-1 text-white" style="font-size: 12px;">Cuenta</p>
                                <span class="{selector('/cuenta')}"></span>
                            </div>
                            
                        </div>
                    </a>

                    {/if}
                </div>
                
                <!-- carrito -->
                
                <button class="col btn text-capitalize mb-0 position-relative p-1 pt-2 text-center" on:click={openModal} style="border-radius: 0.60rem; background-color: #1a1a1a; width: 15%; margin-left: 17px;">
                    <svg class="mb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105.96 98.45" style="width: 35px;">
                        <defs>
                        <style>
                            .cls-1 {font-family: MSReferenceSansSerif, 'MS Reference Sans Serif';font-size: 33px;}
                    
                            .cls-2 {fill: #38a900a8;}
                    
                            #cls-3 {fill: #38a900a8;stroke: #38a900a8;stroke-miterlimit: 10;stroke-width: 4px;text-align:center;}

                            .globo-text{fill: #fff;}

                            .cls-4 {fill: #38a900a8;}
                        </style>
                        </defs>
                        <g>
                        <path class="cls-4" d="M59.28,34.41c6.49,0,12.98-.04,19.47.01,6.25.05,7.49,1.57,6.12,7.45-1.66,7.11-3.29,14.23-5.09,21.31-2.15,8.49-7.02,12.28-15.62,12.32-9.82.04-19.65-.3-29.45.1-10.13.41-14.97-5.45-16.78-13.56-1.95-8.75-4.18-17.44-5.84-26.25-.66-3.49-1.78-5.03-5.44-4.49-3.42.51-6.79,0-6.65-4.43.12-3.98,3.38-4.35,6.57-4.37,11.81-.06,11.76-.06,14.21,11.37,1.94,9.09,4.11,18.13,6.02,27.23.89,4.25,3.13,6.24,7.59,6.17,9.82-.15,19.64-.13,29.45,0,4.17.06,6.51-1.61,7.38-5.74,1.03-4.87,2.1-9.76,3.62-14.49,1.22-3.79-.39-4.12-3.47-4.06-9.32.18-18.63.18-27.95.22-2.16.01-4.33.03-6.48-.13-2.88-.22-4.61-1.56-4.42-4.78.19-3.15,2.3-3.82,4.79-3.84,7.32-.07,14.64-.03,21.97-.03v-.02Z"/>
                        <path class="cls-2" d="M62.23,81.58c4.5-.07,8.48,4.01,8.48,8.69,0,4.44-3.7,8.09-8.28,8.18-4.55.09-8.4-3.5-8.5-7.93-.1-4.62,3.84-8.87,8.29-8.94Z"/>
                        <path class="cls-4" d="M32.24,82.37c4.1.13,7.62,4.07,7.53,8.42-.09,4.53-3.86,7.85-8.68,7.63-4.47-.2-7.67-3.73-7.48-8.23.2-4.55,3.96-7.97,8.62-7.82Z"/>
                        {#if $productCount > 0}
                            <circle id="cls-3" cx="78.45" cy="27.51" r="24.51"/>
                            <text class="cls-1" transform="translate(63.32 35.83)"><tspan class="globo-text" x="{$productCount < 10 ? "5" : "-6"}" y="3">{$productCount}</tspan></text>
                        {/if}
                        </g>
                    </svg>
                </button>
    
            </div>
        </div>
    </div>

</div>
    
    

<style>

    .selector{
        width: 50%;
        height: 4px;
        border-radius: 20px;
        background-color: #39a900;
        position: absolute;
        left: 15px;
        bottom: -2px;

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
    animation: borderLoading 2s linear forwards;
  }

  

.mx-sebas {
  margin-right: -6px !important;
  margin-left: -6px !important;
}

.border-sebas{
    
    border: 0px;
}

.material-symbols-outlined{
    color: white;
}

.bg-select{
   color: #38a900 ;
}
</style>
