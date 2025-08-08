<script>
    import { onMount } from "svelte";
  
    export let productId; // Recibe el ID del producto
    let productData = null; // Almacenará los datos del producto
    let errorMessage = null; // Almacena los mensajes de error
    let isLoading = true; // Para controlar el estado de carga
  
    // Función para obtener el producto por ID
    async function fetchProduct(id) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/publico/productos/${id}`);
        if (!response.ok) {
          throw new Error("No se pudo cargar la información del producto");
        }
        const data = await response.json();
        productData = data;
      } catch (error) {
        errorMessage = error.message;
      } finally {
        isLoading = false;
      }
    }
  
    // Llama a fetchProduct cuando se monta el componente
    onMount(() => {
      fetchProduct(productId);
    });
  
    // Función para cerrar el modal
    export let closeModal;
  </script>
  
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal" style="display: block;">
    <div class="modal-content">

        <div class="col mb-4">
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="close position-absolute text-center" on:click={closeModal}>&times;</div>
        </div>


        <div class="col bg-success">
            {#if isLoading}
            <p>Cargando producto...</p>
          {:else if errorMessage}
            <p>Error: {errorMessage}</p>
          {:else}
            <h2>{productData.nombre}</h2>
            <p>Precio: ${productData.precio}</p>
            <p>Categoría: {productData.categoria}</p>
            <p>Descripción: {productData.descripcion}</p>
            
          {/if}
        </div>
      
    </div>
  </div>
  
  <style>
    /* Estilos básicos del modal */
    .modal {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9998;
    }
  
    .modal-content {
      background-color: #fff;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
      max-width: 500px;
      text-align: center;
      z-index: 9999;
    }
  
    .close {
      font-size: 28px;
      font-weight: bold;
    }
  
    .close:hover, .close:focus {
      color: #000;
      cursor: pointer;
    }
  </style>
  