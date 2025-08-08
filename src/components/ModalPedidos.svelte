<script>
  import { isModalOpenPedidos, idStore } from "../stores/modalStore.js";
  import { onMount, onDestroy } from 'svelte';
  import { fetchWithAuth } from '../api/auth'; // Verifica que la ruta sea correcta
  import { getProductos } from '../api/productos';
  import Swal from 'sweetalert2';

  let productosx = []; // Lista de todos los productos disponibles
  let pedido = null;
  let errorMessage = '';
  let id;

  // Suscripción al idStore
  const unsubscribe = idStore.subscribe(async value => {
    id = value; // Actualiza el ID cuando cambia el valor en el store
    if (id) {
      await fetchPedido(); // Llama a fetchPedido cuando el id cambia
    }
  });

  // Función para obtener los productos disponibles
  async function fetchProductos() {
    try {
      productosx = await getProductos();
    } catch (error) {
      errorMessage = 'No se pudieron cargar los productos.';
      console.error(error);
    }
  }

  async function fetchPedido() {
    if (id) {
      try {
        const data = await fetchWithAuth(`http://127.0.0.1:5000/api/admin/pedidos/${id}`);
        console.log('Datos recibidos:', data);

        // Verifica si la respuesta tiene la estructura que esperas
        if (data) {
          pedido = data; // Asigna el pedido directamente
          console.log('Pedido obtenido:', pedido);
        } else {
          throw new Error('La respuesta no contiene datos válidos');
        }
      } catch (error) {
        console.error('Error al obtener el pedido:', error);
        Swal.fire('Error', 'No se pudo obtener el pedido.', 'error');
        errorMessage = 'No se pudo obtener el pedido.';
      }
    }
  }

  async function cambiarEstado(nuevoEstado) {
  try {
    const response = await fetchWithAuth(`http://127.0.0.1:5000/api/usuarios/pedidos/${pedido?.id_pedido}`, {
      method: 'PATCH',
      body: JSON.stringify({
        estado_pedido: nuevoEstado
      }),
    });

    pedido.estado_pedido = nuevoEstado;
    
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: `El estado se cambió a ${nuevoEstado} correctamente.`,
      timer: 2000, // Tiempo antes de cerrar la alerta (2 segundos)
      showConfirmButton: false,
    }).then(() => {
      window.location.href = '/pedidos_admin'; // Redirige a la ruta raíz después de cerrar la alerta
    });

  } catch (error) {
    console.error('Error al cambiar el estado:', error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Ocurrió un error al cambiar el estado.',
    });
  }
}

  // Función auxiliar para obtener el nombre del producto por su ID
  function obtenerNombreProducto(idProducto) {
    const productoEncontrado = productosx.find((prod) => prod.id === idProducto);
    return productoEncontrado ? productoEncontrado.nombre : 'Producto no encontrado';
  }

  // Llama a las funciones al montar el componente
  onMount(async () => {
    await fetchProductos(); // Primero carga los productos disponibles
    await fetchPedido(); // Luego carga el pedido
  });

  // Limpia la suscripción al desmontar el componente
  onDestroy(() => {
    unsubscribe();
  });

  function handleClickOutside(event) {
    if (event.target.classList.contains("modal")) {
      isModalOpenPedidos.set(false); // Cierra el modal
    }
  }
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="modal" class:open={$isModalOpenPedidos} on:click={handleClickOutside} role="dialog" aria-modal="true">
  <div class="modal-content">

    <div class="col mb-4">
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="close position-absolute text-center" on:click={() => isModalOpenPedidos.set(false)}>&times;</div>
    </div>
    {#if pedido}
      <div>
        <div class="row">
          <div class="col-6">
            <h4>Información del Pedido</h4>
            <span>ID del pedido - 00{pedido.id_pedido}</span><br>
            <span>Monto total - {pedido.monto_total}</span><br>

            <span>Estado del pedido - 
              {#if pedido.estado_pedido === "PENDIENTE"}
                <span class="text-info font-weight-bold"> {pedido.estado_pedido}</span>
              {:else if pedido.estado_pedido === "APROBADO"}
                <span class="text-success font-weight-bold"> {pedido.estado_pedido}</span>
              {:else if pedido.estado_pedido === "CANCELADO"}
                <span class="text-danger font-weight-bold"> {pedido.estado_pedido}</span>
              {:else if pedido.estado_pedido === "ENTREGADO"}
                <span class="text-success font-weight-bold"> {pedido.estado_pedido}</span>
              {:else if pedido.estado_pedido === "DEVUELTO"}
                <span class="text-warning font-weight-bold"> {pedido.estado_pedido}</span>
              {/if}
            </span><br>

            <span>Fecha de creación - {pedido.fecha_creacion}</span><br>

            <span>Cliente - {pedido.nombre_usuario} {pedido.apellido_usuario}</span><br>

            <span>Indentificación - {pedido.identificacion_usuario}</span>

          </div>

          <!-- Botones para cambiar el estado del pedido -->
          <div class="col-6">
            <h4 class="">Cambiar Estado del Pedido</h4>
            <!-- <button on:click={() => cambiarEstado('APROBADO')} class="btn btn-success">Aprobar</button> -->
             {#if pedido.estado_pedido === "PENDIENTE"}
              <button on:click={() => cambiarEstado('CANCELADO')} class="btn btn-danger">Cancelar</button>
              <button on:click={() => cambiarEstado('ENTREGADO')} class="btn btn-success">Entregar</button>
              {:else if pedido.estado_pedido === "ENTREGADO"}
              <button on:click={() => cambiarEstado('DEVUELTO')} class="btn btn-warning">Devolver</button>
              {:else if pedido.estado_pedido === "DEVUELTO"}
              <button class="btn btn-warning" disabled>Devuelto</button>
              {:else}
              <button class="btn btn-danger" disabled>Cancelado</button>
             {/if}
          </div>

        </div>

        <!-- Tabla de productos del pedido -->
        <h4 class="mt-3">Productos del Pedido</h4>
        <div class="border table-responsive">
          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre del Producto</th>
                <th class="text-center">Cantidad</th>
                <th class="text-center">Precio</th>
              </tr>
            </thead>
            <tbody>
              {#if pedido.productos && pedido.productos.length > 0}
                {#each pedido.productos as producto}
                <tr>
                  <td>{producto.id}</td>
                  <td>{producto.nombre_producto} x{Math.trunc(producto.cantidad_producto)} {producto.unidad_producto}</td>
                  <td class="text-center">{producto.cantidad}</td>
                  <td class="text-center">{producto.precio}</td>
                </tr>
                {/each}
              {:else}
                <p>No hay productos en este pedido.</p>
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    {:else if errorMessage}
      <p>{errorMessage}</p>
    {:else}
      <p>Cargando información del pedido...</p>
    {/if}
  </div>
</div>

<style>
  /* Estilos del modal */
  .modal {
    display: none;
    position: fixed;
    z-index: 999;
    padding-top: 50px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal.open {
    display: block;
  }

  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 85%;
  }

  .close {
    color: #aaa;
    font-size: 40px;
    font-weight: bold;
    width: 50px;
    top: -7px;
    right: 0px;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }

  /* Botones de cambio de estado */
  .btn {
    margin-right: 10px;
  }
</style>
