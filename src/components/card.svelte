<script>
  import Swal from "sweetalert2";
  export let producto;
    let noDisponible = producto.is_activo === false;
    let fotoNoDisponible = producto.url_imagen === "";

    import { onMount } from "svelte";

    // carrito

    import { getContext } from 'svelte';
    import { cart, incrementQuantity, decrementQuantity } from '../stores/cart';

    export let addToCart; // Propiedad para recibir la función addToCart desde Home.svelte

    let isInCart = false;
    let itemQuantity = 0;

    // Suscripción a la tienda del carrito para reactividad
    $: {
      const cartItems = $cart;
      const item = cartItems.find(item => item.id === producto.id);
      isInCart = !!item;
      itemQuantity = item ? item.quantity : 0;
    }

    // Verificar si el producto está en el carrito al montar el componente
    onMount(() => {
      const cartItems = $cart;
      const item = cartItems.find(item => item.id === producto.id);
      isInCart = !!item;
      itemQuantity = item ? item.quantity : 0;
    });

    // Función para agregar al carrito usando la función addToCart de Home.svelte
    function handleAddToCart() {
      addToCart(producto);
    }

    // Función para obtener la cantidad del producto directamente desde localStorage 🌟🌟🌟
    function cantidadProductoEnHistorial(productoId) {
        const historial = JSON.parse(localStorage.getItem('historial_pedido')) || {};
        return historial[productoId] || 0; // Devuelve 0 si el producto no existe en el historial
    }

    // Función que maneja el error de la imagen
    function manejarErrorImagen(event) {
      event.target.src = "/img/carrito-vacio.png"; // Cambiar a la imagen alternativa
    }

  </script>
  
  <div class="card bg-gray {noDisponible ? 'bg-gray-200 ' : ''} position-relative">
    
    {#if producto.is_promocion === true && producto.is_activo === true}
        <span class="bg-success opacity-9 col-6 col-sm-4 text-white text-center position-absolute" style="z-index: 3; border-radius: 10px 0px 20px 0px;">
          - {Math.trunc(producto.descuento)}%
        </span>
    {/if}

    {#if producto.stock === 0 && producto.is_activo === true}
        <span class="bg-gray-600 col-7 col-sm-6 text-white text-center position-absolute" style="z-index: 3; border-radius: 10px 0px 20px 0px;">
        Agotado
        </span>
    {/if}

    
    <div class="card-header p-0 position-relative z-index-2" style="border-radius: 0.75rem 0.75rem 0px 0px">
      <div class="d-block blur-shadow-image cursor-pointer img-marco" >
        <a href="{`/ver_producto/${producto.id}`}">
          <img src="{fotoNoDisponible ? '/img/sin-productos.webp' : producto.url_imagen}" width="100%" height="170vh" alt="producto" class="border-bottom img-size {producto.is_promocion ? 'img-oferta' : 'img'} {producto.is_activo ? '' : 'img-no-activo'}" style="border-radius: 0.75rem 0.75rem 0px 0px" on:error={manejarErrorImagen}>
        </a>
        
      </div>
      <div class="blur opacity-9 col-8 col-sm-6 text-dark text-center position-absolute" style="z-index: 3; border-radius: 7px 0px 0px 0px; bottom: 1px; right: 1px; height: 20px; font-size: 15px;">
        stock {Math.trunc(producto.stock)}
      </div>
      

      <div class="colored-shadow" style="background-image: url(&quot;{producto.url_imagen}&quot;);"></div>
    </div>
    <div class="px-2 py-0">
      <p class="text-dark text-center nombre mt-1 mb-0">{producto.nombre.length >= 15 ? producto.nombre.substring(0, 15) + "..." : producto.nombre}</p>
        <div class="row justify-space-between text-center">
          <div class="col-12 mt-n1">
            <span class="badge border border-1 text-dark justify-space-between" style="font-size: 10px;">x {producto.cantidad} {producto.unidad_producto}</span>
          </div>
        </div>

      {#if producto.is_promocion === true && producto.is_activo === true} 
        <div class="text-warning text-center border-bottom border-gray mb-3">
          <del class="text-underline text-start text-dark opacity-9 " style="font-size: 12px;left: 14px;" >$ {producto.precio}</del>
          ${producto.precio-producto.precio*producto.descuento/100}
        </div>
        {:else}
        <p class="text-success text-center border-bottom border-gray mb-3">$ {producto.precio}</p>
      {/if}

      
      <div class="row text-center mt-4">
        <p class="col mt-n3 my-0" style="font-size: 13px;">
          {#if producto.stock > 0}
            {#if producto.max_usuario === 0}
            limite {producto.stock}
            {:else}
              {#if itemQuantity < producto.max_usuario-cantidadProductoEnHistorial(producto.id)}
              Límite {producto.max_usuario-cantidadProductoEnHistorial(producto.id)}/{producto.max_usuario} 
              {:else}
              ¡limite alcanzado!
              {/if}
            {/if}

          {:else}
            Mira otros productos
          {/if}
        </p>
        <div class="col-md-10 col-12 mx-auto">

          {#if producto.is_activo === true}
            {#if isInCart}
              <div>
                {#if itemQuantity <=1}
                  <button class="btn col btn-sm border border-danger   text-danger" on:click={() => decrementQuantity(producto.id)}>x</button>
                {:else}
                  <button class="btn col btn-sm border border-dark" on:click={() => decrementQuantity(producto.id)}>-</button>
                {/if}
                <span class="col p-1 btn disabled text-dark">{itemQuantity}</span>

                {#if (producto.max_usuario === 0 && itemQuantity < producto.stock) || (producto.max_usuario > 0 && itemQuantity < Math.min(producto.stock, producto.max_usuario - cantidadProductoEnHistorial(producto.id)))}
                <button class="btn col btn-sm border border-success text-success" on:click={() => incrementQuantity(producto.id)}>+</button>
                {:else}
                  <button class="btn col btn-sm border text-dark" disabled on:click={() => incrementQuantity(producto.id)}>max</button>
                {/if}
              </div>
            {/if}

            {#if producto.stock > 0}
            
              {#if !isInCart && cantidadProductoEnHistorial(producto.id) < producto.max_usuario || producto.max_usuario === 0 && !isInCart}
                <button class="btn col-12 btn-sm btn-success" on:click={handleAddToCart}>Agregar</button>
                {:else if !isInCart}
                <button class="btn col-12 btn-sm btn-warning invalid disabled text-white">Comprado</button>
              {/if}

              {:else}
              {#if cantidadProductoEnHistorial(producto.id) === producto.max_usuario && producto.max_usuario != 0}
              <button class="btn col-12 btn-sm btn-warning invalid disabled text-white">Comprado</button>

                {:else if !isInCart}
                <button class="btn col-12 btn-sm bg-info text-white invalid disabled">Agotado</button>

              {/if}
              
            {/if}

          {/if}

          
        </div>
      </div>
    </div>
    
  </div>

  <style>
    @media (max-width: 768px) {
      .img-size {
        height: 140px;
      }
      .img-marco{
        height: 140px;
      }
    }

    .nombre::first-letter {
      text-transform: uppercase;
    }

    .img, .img-oferta {
      transition: transform 0.3s ease, background-color 0.3s ease;
      cursor: pointer;
    }

    /* Efecto hover */
    .img:hover {
      border: 2px solid white;
      border-bottom: 1px solid white;
      
    }
    .img-oferta:hover {
      border: 2px solid #fff;
      border-bottom: 1px solid #ffff;
    }

    .img-no-activo:hover{
      border: 2px solid #ffff;
      border-bottom: 1px solid #ffff;

    }
  
    .invalid{
      cursor: not-allowed;
    }
  </style>
  