<script>
  import { onMount } from 'svelte';

  // Importar la tienda del carrito y funciones para modificarla
  import { cart, addToCart, incrementQuantity, decrementQuantity } from '../stores/cart';
  import Nav from '../components/nav.svelte';
  import Menufooter from '../components/menufooter.svelte';
  import Footer from '../components/Footer.svelte';

  // Recibir el `id` como prop
  export let id;

  // Variable para almacenar el producto
  let producto = null;
  let errorMessage = ''; // Variable para almacenar mensajes de error

  // Variables para el estado del carrito
  let isInCart = false;
  let itemQuantity = 0;

  // Función para obtener el producto
  async function fetchProducto() {
    try {
      // Realiza la solicitud para obtener el producto por ID
      const response = await fetch(`http://127.0.0.1:5000/api/publico/productos/${id}`);

      // Verifica si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error('No se pudo obtener el producto');
      }

      // Convierte la respuesta en un objeto JSON
      const data = await response.json();
      console.log('Datos recibidos:', data);

      // Asigna el producto obtenido
      producto = data;
      console.log('Producto obtenido:', producto);

      // Verificar si el producto ya está en el carrito
      checkCartStatus();
    } catch (error) {
      // Muestra el error en consola y guarda un mensaje de error
      console.error('Error:', error);
      errorMessage = 'No se pudo cargar el producto.';
    }
  }

  // Verificar si el producto está en el carrito
  function checkCartStatus() {
    const cartItems = $cart; // Obtiene el estado actual del carrito
    const item = cartItems.find(item => item.id === producto.id);
    isInCart = !!item;
    itemQuantity = item ? item.quantity : 0;
  }

  // Llama a la función al montar el componente
  onMount(() => {
    console.log('ID del producto:', id);
    if (id) {
      fetchProducto();
    }
  });

  let isFading = false;
  // Función para agregar al carrito
  function handleAddToCart() {
    isFading = true; // Activa el efecto de desvanecimiento
    
      addToCart(producto); // Llama a la función de la tienda del carrito
      checkCartStatus(); // Actualiza el estado del carrito
      isFading = false; // Restaura el estado del botón si lo necesitas para futuras acciones

    
  }

  // Función para incrementar la cantidad
  function handleIncrement() {
    incrementQuantity(producto.id); // Incrementa la cantidad en el carrito
    checkCartStatus(); // Actualiza el estado del carrito
  }

  // Función para decrementar la cantidad
  function handleDecrement() {
    decrementQuantity(producto.id); // Decrementa la cantidad en el carrito
    checkCartStatus(); // Actualiza el estado del carrito
  }


  // COPIAR urlFichaTecnica PRODUCTO

 // Función para copiar el valor al portapapeles

    let mensajeCopiado = false; // Estado para controlar la visibilidad del mensaje

    // Función para copiar el valor al portapapeles y mostrar el mensaje temporalmente
    const copiarAlPortapapeles = async () => {
        try {
            await navigator.clipboard.writeText(producto.url_ficha_tecnica);
            mensajeCopiado = true; // Mostrar el mensaje
            setTimeout(() => {
                mensajeCopiado = false; // Ocultar el mensaje después de 2 segundos
            }, 2000);
        } catch (err) {
            console.error("Error al copiar: ", err);
        }
    };

    // Función para obtener la cantidad del producto directamente desde localStorage 🌟🌟🌟
    function cantidadProductoEnHistorial(productoId) {
        const historial = JSON.parse(localStorage.getItem('historial_pedido')) || {};
        return historial[productoId] || 0; // Devuelve 0 si el producto no existe en el historial
    }

    let currentUrl = window.location.href;

    function share() {
      if (navigator.share) {
        navigator.share({
          title: document.title,
          text: "Te comparto este enlace:",
          url: currentUrl,
        })
        .then(() => console.log("Contenido compartido exitosamente"))
        .catch((error) => console.error("Error al compartir:", error));
      } else {
        alert("La función de compartir no está disponible en este navegador.");
      }
    }
</script>

<main>
  <Nav/>
  <div class="container">
    {#if producto}
    <h4>Detalles del producto</h4>
    <div class="card p-4">
      <a href={`https://wa.me/?text=${encodeURIComponent("He encontrado este producto en Vitrina web CBC y creo que puede interesarte:\n" + currentUrl + "\n" + producto.nombre)}`}
        class="material-symbols-outlined simbolo-icon p-2 text-dark bg-white border cursor-pointer"
        translate="no" target="_blank"
        style="position: absolute; right: -8px; top: -8px; border-radius: 50px;">
        share
      </a>


      <div class="row">
        <div class="col-12 col-md-5 mb-3">
          <img class="w-100 border-radius-2xl" src="{producto.url_imagen}" alt="">
        </div>
        <div class="col">
          <h5>{producto.nombre}</h5>
          <p class="mb-2">{producto.descripcion}</p>
          {#if producto.is_promocion === true && producto.is_activo === true} 
            <div class="text-warning mb-3 pb-2">
              <del class="text-underline text-start text-dark opacity-9 " style="font-size: 12px;left: 14px;" >$ {producto.precio}</del>
              ${producto.precio-producto.precio*producto.descuento/100}
              <span class="text-dark text-sm">{producto.unidad_producto}</span>
            </div>
            {:else}
            <p class="text-success mt-1 mb-3 pb-2">$ {producto.precio} <span class="text-dark text-sm">{producto.unidad_producto}</span></p>
          {/if}
          <!-- <div class="row">
            <div class="col-auto">
              <button class="btn py-0 px-2 btn-sm bg-info text-white" on:click={copiarAlPortapapeles}>Copiar ficha tecnica</button>
            </div>
            <div class="mt-n4" style="width: 110px;">
              {#if mensajeCopiado}
                <div class="badge bg-gray-700">
                    ¡Copiado!
                </div>
              {/if}
            </div>
          </div> -->

          <div class="row mt-2">
            <p class="col-12 mt-n3 my-0" style="font-size: 13px;">
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
            <div class="col mx-auto">
    
              {#if producto.is_activo === true}
                {#if isInCart}
                  <div>
                    {#if itemQuantity <=1}
                      <button class="btn col btn-sm border border-danger   text-danger" on:click={handleDecrement}>x</button>
                    {:else}
                      <button class="btn col btn-sm border border-dark" on:click={handleDecrement}>-</button>
                    {/if}
                    <span class="col p-1 btn disabled text-dark">{itemQuantity}</span>

                    {#if (producto.max_usuario === 0 && itemQuantity < producto.stock) || (producto.max_usuario > 0 && itemQuantity < Math.min(producto.stock, producto.max_usuario - cantidadProductoEnHistorial(producto.id)))}
                    <button class="btn col btn-sm border border-success text-success" on:click={handleIncrement}>+</button>
                    {:else}
                      <button class="btn col btn-sm border text-dark" disabled>max</button>
                    {/if}
                  </div>
                {/if}
    
                {#if producto.stock > 0}
                
                  {#if !isInCart && cantidadProductoEnHistorial(producto.id) < producto.max_usuario || producto.max_usuario === 0 && !isInCart}
                    <button class="btn col btn-sm btn-success" on:click={handleAddToCart}>Agregar al carrito</button>
                    {:else if !isInCart}
                    <button class="btn col btn-sm btn-warning">Comprado</button>
                  {/if}
    
                  {:else}
                  {#if cantidadProductoEnHistorial(producto.id) === producto.max_usuario && producto.max_usuario != 0}
                    <button class="btn col btn-sm btn-warning">Comprado</button>
                    {:else if !isInCart}
                    <button class="btn col btn-sm bg-info text-white invalid disabled">Agotado</button>
                  {/if}
                {/if}
    
              {/if}
    
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else if errorMessage}
    <p>{errorMessage}</p>
  {:else}
    <p>Cargando el producto...</p>
  {/if}
  </div>

  <Menufooter/>

  <Footer/>

</main>


