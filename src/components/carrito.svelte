<script>
    import { cart, incrementQuantity, decrementQuantity } from '../stores/cart';
    import { onMount } from 'svelte';
  
    let cartItems = [];
    cart.subscribe(value => {
      cartItems = value;
    });

    // Función para obtener la cantidad del producto directamente desde localStorage 🌟🌟🌟
    function cantidadProductoEnHistorial(productoId) {
        const historial = JSON.parse(localStorage.getItem('historial_pedido')) || {};
        return historial[productoId] || 0; // Devuelve 0 si el producto no existe en el historial
    }

  </script>
  
  <div class="cart">
    {#if cartItems.length === 0}
    <div class="text-center my-5">
      <div class="col-12">
        <img class="" src="/img/sin-productos.webp" alt="No products available" style="width: 220px; height: auto;">
      </div>
      <h4 class="mt-3">El carrito está vacio</h4>
      <p>Agrega productos para continuar con el pedido</p>
      <a href="/" class="btn btn-sm btn-success">ir a comprar</a>
    </div>
    {/if}
    <div class="row justify-content-center">
      {#each cartItems as item (item.id)}
      <div class="col-12 col-sm-6 p-2">
        <div class="card border mx-0 px-3 py-2">
          <div class="row">

            <div class="col-12 col-xl-4 text-center my-auto ">
              <img src="{item.url_imagen}" alt="" width="150px" height="120px" class="border-radius-lg icon-md-xl">
            </div>

            <div class="col">

              <div class="row">

                <div class="col-12">
                  <div class="row my-auto">
                    <h6 class="text-dark text-center text-xl-start col-12 my-0">{item.nombre}</h6>
                    <h6 class="text-dark text-center text-xl-start col-12 my-0">${item.is_promocion ? item.precio-item.precio*item.descuento/100 : item.precio}</h6>
                    <p class="m-0 d-none d-md-block col-12 text-center text-xl-start" style="font-size:12px; min-height: 40px;">{item.descripcion}</p>
                  </div>
                </div>
                
                <p class="text-dark text-bold col-12 text-center col-md-6 text-xl-start pt-3 my-0">Subtotal: <span class="text-success">$ {item.is_promocion 
                ? (item.precio-item.precio*item.descuento/100) * item.quantity : item.precio*item.quantity}</span> </p>
                
                <div class="col-12 col-md-6 text-center mt-3 mb-n2">
                  <p class="col mt-n3 my-0" style="font-size: 13px;">
                    {#if item.stock > 0}
                      {#if item.max_usuario === 0}
                      limite {item.stock}
                      {:else}
                        {#if item.quantity < item.max_usuario-cantidadProductoEnHistorial(item.id)}
                        Límite {item.max_usuario-cantidadProductoEnHistorial(item.id)}/{item.max_usuario} 
                        {:else}
                        ¡limite alcanzado!
                        {/if}
                      {/if}

                    {:else}
                      Mira otros productos
                    {/if}
                  </p>

                  {#if item.quantity <=1}
                    <button class="btn col btn-sm border border-danger   text-danger" on:click={() => decrementQuantity(item.id)}>x</button>
                  {:else}
                    <button class="btn col btn-sm border border-dark" on:click={() => decrementQuantity(item.id)}>-</button>
                  {/if}
                  <span class="col p-1 btn disabled text-dark">{item.quantity}</span>

                  {#if (item.max_usuario === 0 && item.quantity < item.stock) || (item.max_usuario > 0 && item.quantity < Math.min(item.stock, item.max_usuario - cantidadProductoEnHistorial(item.id)))}
                    <button class="btn col btn-sm border border-success text-success" on:click={() => incrementQuantity(item.id)}>+</button>
                  {:else}
                    <button class="btn col btn-sm border text-dark" disabled>max</button>
                  {/if}
          
                </div>
                  
              </div>

            </div>
            
          </div>
          
          
         
        </div>
      </div>
        
      {/each}
    </div>
    
  </div>
  