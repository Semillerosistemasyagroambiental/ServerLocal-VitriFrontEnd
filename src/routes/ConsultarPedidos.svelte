<script>
    import Footer from '../components/Footer.svelte';
    import { onMount } from 'svelte';
    import { getPedidosMod } from '../api/pedidoAdmin';
    import MenuAcciones from '../components/MenuLateral.svelte';
    
    // Importamos las librerías de DataTables
    import jQuery from 'jquery';
    import 'datatables.net-dt';

    let pedidos = [];
    let errorMessage = '';

    // Cargar los pedidos
    onMount(async () => {
        try {
            pedidos = await getPedidosMod();
        } catch (error) {
            errorMessage = 'No se pudieron cargar los pedidos.';
        }
    });

    // modal carrito
    import { idStore, isModalOpenPedidosMod } from '../stores/modalStore';
    import { right } from '@popperjs/core';
    import Nav from '../components/nav.svelte';
    import Menufooter from '../components/menufooter.svelte';
    import ModalPedidosMod from '../components/ModalPedidosMod.svelte';
    import ProteccionMod from '../components/ProteccionMod.svelte';

    function openModal(id) {
        idStore.set(id); // Asigna el ID al store
        isModalOpenPedidosMod.set(true); // Abre el modal
    }

    // Inicializar DataTable después de cargar los pedidos
    onMount(() => {
        const tableInterval = setInterval(() => {
            if (pedidos.length > 0) {
                jQuery('#tablaPedidos').DataTable({
                    order: [[0, 'desc']], // Ordena la primera columna (ID) en orden descendente
                    language: {
                        search: "Busqueda Dinamica",
                        lengthMenu: "Mostrar _MENU_",
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

    function formatearFechaUTC(fechaGMT) {
        const fecha = new Date(fechaGMT);

        // Formatear fecha en UTC
        const dia = fecha.getUTCDate();
        const mes = fecha.toLocaleString('es-ES', { month: 'long', timeZone: 'UTC' });
        const anio = fecha.getUTCFullYear();

        const hora = fecha.getUTCHours().toString().padStart(2, '0');
        const minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
        const segundos = fecha.getUTCSeconds().toString().padStart(2, '0');

        return {
            fechaFormateada: `${dia} de ${mes} de ${anio}`,
            horaFormateada: `${hora}:${minutos}:${segundos}`,
        };
    }
</script>

<main>

    <ModalPedidosMod/>
    <ProteccionMod/>

        <div class="row m-0" style="min-height: 83vh;">


            <div class="col">
                <div class="col-12">
                    <h4 class="col-12 pt-3">Consultar pedidos</h4>
                    <div class="card mt-3 p-2">
                        <div class="table-responsive">
                            <table id="tablaPedidos" class="table align-items-center m-0">
                                <thead>
                                    <tr>
                                        <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7">Id</th>
                                        <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7">Estado pedido</th>
                                        <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7 ">Total</th>
                                        <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7 ">Fecha de creación</th>
                                        <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7 ">Cliente</th>
                                        <th class="text-uppercase font-weight-bolder opacity-7"></th>
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
                                        <td class="sticky-left bg-white">
                                            <p class="text-sm mb-0 text-center">
                                                <span class=" font-weight-bold">00{values.id_pedido}  </span>
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
            
                                        <td class="">
                                            <p class="text-sm mb-0 text-center">
                                                <span class=" font-weight-bold"> {values.monto_total}  </span>
                                            </p>
                                        </td>
    
                                        
            
                                        <td class="text-sm mb-0 text-center">
                                            <p class="mb-0">
                                                <span class="">{formatearFechaUTC(values.fecha_creacion).fechaFormateada}</span><br>
                                                <span class="">hora: {formatearFechaUTC(values.fecha_creacion).horaFormateada}</span>
                                            </p>
                                            
                                        </td>
    
                                        <td class="">
                                            <p class="text-sm mb-0 text-center">
                                                <span class="">{values.nombre_usuario} {values.apellido_usuario}</span><br>
                                                <span class=" font-weight-bold">{values.identificacion_usuario} </span>
                                            </p>
                                        </td>
    
                                        <td class=" col sticky-right p-0 bg-white">
                                            <div class="row py-1">
                                                <div class="col-12 text-center mb-1"><button on:click={() => openModal(values.id_pedido)} class="btn btn-sm text-white bg-info mb-0">Ver</button></div>
                                            </div>
                                            
                                            <!-- <a class="btn btn-sm btn-outline-success" href={`/pedidos_admin/${values.id_pedido}`}>Editar</a> -->
                                        </td>
                                    </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>

        <Menufooter/>

        <Footer/>
        <style>
            /* Fijar la primera columna */
            td.sticky-right {
              position: sticky;
              right: 0;
              z-index: 10; /* Asegura que la columna esté por encima de las demás */
            }

            td.sticky-left {
              position: sticky;
              left: 0;
              z-index: 10; /* Asegura que la columna esté por encima de las demás */
            }

            td{
                border-top:1px solid #eee ;
                border-bottom:1px solid #eee ;
            }

          </style>
        
</main>

