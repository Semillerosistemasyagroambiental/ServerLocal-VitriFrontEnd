<script>
    import { onMount } from 'svelte';
    import { fetchWithAuth } from '../api/auth'; // Verifica que la ruta sea correcta

    // Recibir el `id` como prop
    export let id;
  
    // Variable para almacenar el pedido
    let pedido = null;
  
    async function fetchPedido() {
    try {
        // Aquí `response` es el objeto de datos directamente
        const data = await fetchWithAuth(`http://127.0.0.1:5000/api/usuarios/pedidos/${id}`);
        console.log('Datos recibidos:', data);

        // Ahora verifica si data es el cuerpo de respuesta esperado
        pedido = data;
        console.log('Pedido obtenido:', pedido);
    } catch (error) {
        console.error('Error:', error);
    }
    }


  
    // Llama a la función al montar el componente
    onMount(() => {
        console.log('ID del pedido:', id);
      if (id) {
        fetchPedido();
      }
    });
  </script>
<main>
    {#if pedido}
      <h2>Detalles del Pedido</h2>
      <div>
        <p><strong>ID del Pedido:</strong> {pedido.id_pedido}</p>
        <p><strong>Monto Total:</strong> {pedido.monto_total}</p>
        <p><strong>Estado:</strong> {pedido.estado_pedido}</p>
        <p><strong>Fecha de Creación:</strong> {new Date(pedido.fecha_creacion).toLocaleString()}</p>
  
        <h3>Productos</h3>
        <ul>
          {#each pedido.productos as producto}
            <li>
              <strong>Producto ID:</strong> {producto.id} - 
              <strong>Cantidad:</strong> {producto.cantidad} - 
              <strong>Precio:</strong> {producto.precio}
            </li>
          {/each}
        </ul>
      </div>
    {:else}
      <p>Cargando el pedido...</p>
    {/if}
  </main>
  
  <style>
    main {
      padding: 20px;
    }
    h2 {
      margin-bottom: 20px;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin: 5px 0;
    }
  </style>