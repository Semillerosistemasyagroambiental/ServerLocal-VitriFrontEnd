<script>
    import Menufooter from '../components/menufooter.svelte';
    import { isAuthenticated, checkAuth } from '../stores/auth';
    import Footer from '../components/Footer.svelte';
    import Nav from '../components/nav.svelte';
    import { onMount } from 'svelte';
    import { getMisPedidos } from '../api/pedidoAdmin';

    // Importamos las librerías de DataTables
    import jQuery from 'jquery';
    import 'datatables.net-dt';

    let pedidos = [];
    let errorMessage = '';

    // Cargar los pedidos
    onMount(async () => {
        try {
            pedidos = await getMisPedidos();
        } catch (error) {
            errorMessage = 'No se pudieron cargar los pedidos.';
        }
    });

    // redirigir si no iniciado sesion
    let isAuth = false;
    onMount(async () => {
        isAuth = await checkAuth();
        if (!isAuth) {
            window.location.href = '/login'; // Redirige al login si no está autenticado
        }
    });

    // modal carrito
    import { idStore, isModalOpenPedidos } from '../stores/modalStore';
    import ModalMisPedidos from '../components/ModalMisPedidos.svelte';

    function openModal(id) {
        idStore.set(id); // Asigna el ID al store
        isModalOpenPedidos.set(true); // Abre el modal
    }

    // Inicializar DataTable después de cargar los pedidos
    onMount(() => {
        const tableInterval = setInterval(() => {
            if (pedidos.length > 0) {
                jQuery('#tablaPedidos').DataTable({
                    order: [
                        [2, 'dsc'], // Ordenar por estado (Pendiente primero)
                        [0, 'dsc']  // Ordenar por fecha de creación (más antigua primero) 
                    ],
                    language: {
                        search: "Buscar mis pedidos:",
                        lengthMenu: "Mostrar _MENU_ entradas",
                        info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                        infoEmpty: "No hay entradas disponibles",
                        infoFiltered: "(filtrado de _MAX_ entradas totales)",
                        paginate: {
                            first: "Primero",
                            last: "Último",
                            next: "Siguiente",
                            previous: "Anterior"
                        },
                        zeroRecords: "No se encontraron registros coincidentes" // Traducción aquí
                    }
                }); // Inicializa DataTable
                clearInterval(tableInterval);
            }
        }, 300); // Revisa cada 300ms hasta que los pedidos se hayan cargado
    });

</script>

<main>
  <Nav/>
  <ModalMisPedidos/>
  <header class="bg-gradient-dark mt-n4">
    <div class="page-header min-vh-35" style="background-image: url(&quot;/img/img-sena/sena2.jpeg&quot;); background-position-y: 60%; background-size: cover; background-position-x: 70%;">
      <span class="mask bg-gradient-dark opacity-8"></span>
      
    </div>
</header>


<div class="container">
  <div class="col-12 mt-n7 mx-auto">
    <div class="card p-4">
        <h5 class="col-8">Mis pedidos</h5>
      <div id="productTable" class="table-responsive">
        <table id="tablaPedidos" class="table display align-items-center mb-0">
            <thead>
                <tr>
                    <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7">Id del pedido</th>
                    <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7">Monto total</th>
                    <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7">Estado del pedido</th>
                    <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7">Fecha de creación</th>
                    <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {#if errorMessage}
                <tr><td colspan="6" class="text-center"><p>{errorMessage}</p></td></tr>
                {/if}
                {#if pedidos.length === 0}
                <tr><td colspan="6" class="text-center"><p>No hay pedidos disponibles.</p></td></tr>
                {/if}

                {#each pedidos as values}
                <tr>
                    <td>
                        <p class="text-sm mb-0 text-center">
                            <span class=" font-weight-bold">009{values.id_pedido}</span>
                        </p>
                    </td>

                    <td>
                        <p class="text-sm mb-0 text-center">
                            <span class=" font-weight-bold"> {values.monto_total}  </span>
                        </p>
                    </td>

                    <td>
                        <p class="text-sm mb-0 text-center">
                            {#if values.estado_pedido === "PENDIENTE"}
                            <span class="text-info font-weight-bold"> {values.estado_pedido}  </span>
                                {:else if values.estado_pedido === "APROBADO"}
                                <span class="text-success font-weight-bold"> {values.estado_pedido}  </span>
                                {:else if values.estado_pedido === "CANCELADO"}
                                <span class="text-danger font-weight-bold"> {values.estado_pedido}</span>
                                {:else if values.estado_pedido === "ENTREGADO"}
                                <span class="text-success font-weight-bold"> {values.estado_pedido}</span>
                                {:else if values.estado_pedido === "DEVUELTO"}
                                <span class="text-warning font-weight-bold"> {values.estado_pedido}</span>
                            {/if}
                        </p>
                    </td>

                    <td>
                        <p class="text-sm mb-0 text-center">
                            <span class=" font-weight-bold"> {values.fecha_creacion}  </span>
                        </p>
                    </td>

                    <td class="text-center">
                        <a href="/soporte/{values.id_pedido}" class="btn btn-sm px-1 pb-0 text-white bg-success">
                            <span class="material-symbols-outlined simbolo-icon">contract</span>
                        </a>
                        <button on:click={() => openModal(values.id_pedido)} class="btn btn-sm text-white bg-info">Detalles</button>
                    </td>
                </tr>
                {/each}
            </tbody>
        </table>
    </div>
      
  </div>

  <div class="container text-center my-4">
      <a href="/cuenta" class=" btn btn-sm btn-danger mb-0">
        Volver
      </a>

  </div>
  </div>
</div>

<Menufooter/>
<Footer/>
</main>

