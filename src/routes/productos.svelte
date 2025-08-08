<script>
    import { isAuthenticated, checkAuth } from '../stores/auth';
    import { eliminarProducto } from '../api/productos';
    import { onMount } from 'svelte';
    import { getProductos } from '../api/productos';
    import MenuAcciones from '../components/MenuLateral.svelte';

    // Importamos las librerías de DataTables
    import jQuery from 'jquery';
    import 'datatables.net-dt';
    // import Footer from '../components/Footer.svelte';

    let productos = [];
    let errorMessage = '';

    onMount(async () => {
        try {
            productos = await getProductos();
        } catch (error) {
            errorMessage = 'No se pudieron cargar los productos.';
        }
    });

    onMount(() => {
        const tableInterval = setInterval(() => {
            if (productos.length > 0) {
                jQuery('#tablaPedidos').DataTable({
                    order: [
                        [1, 'dsc'], // Ordenar ultima actualizacion
                    ],
                    language: {
                        search: "Busqueda Dinámica",
                        lengthMenu: "Mostrar  _MENU_",
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
        }, 100); // Revisa cada 300ms hasta que los pedidos se hayan cargado
    });

// Función para formatear la fecha en español con "-"
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);

    if (isNaN(fecha.getTime())) return { fechaFormateada: "Fecha inválida", horaFormateada: "" };

    // Obtener la fecha en UTC
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // +1 porque los meses van de 0 a 11
    const anio = fecha.getUTCFullYear();

    // Obtener la hora en UTC
    const horas = String(fecha.getUTCHours()).padStart(2, '0');
    const minutos = String(fecha.getUTCMinutes()).padStart(2, '0');
    const segundos = String(fecha.getUTCSeconds()).padStart(2, '0');

    return { 
        fechaFormateada: `${anio}-${mes}-${dia}`, 
        horaFormateada: `${horas}:${minutos}:${segundos}`
    };
}


</script>

<main>

    <div class="row m-0" style="padding-left: 4.5rem;">
        <MenuAcciones/>
        <div class="col">
            <div class="row">
                <h4 class="col-6 text-dark pt-3">Productos</h4>
                <div class="col-6 mt-3 text-end">
                    <a href="/producto/nuevo" class="btn btn-sm btn-success">Agregar producto</a>
                </div>
            </div>
            
            <div class="card p-2 mt-3">
                <div class="table-responsive">
                    <table id="tablaPedidos" class="table align-items-center mb-0">
                        
                        <thead>
                            <tr>
                                <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7">id</th>
                                <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7 d-none">fecha Actualizacion</th>
                                <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7">Nombre</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Precios y descuentos</th>
                                <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7">estado de producto</th>
                                <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7">Stock</th>
                                <th class="text-uppercase text-secondary text-center text-xxs font-weight-bolder opacity-7">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#if errorMessage}
                            <tr><td><p>{errorMessage}</p></td></tr>
                            {/if}
                            {#if productos.length === 0}
                            <tr><td><p>No hay productos disponibles.</p></td></tr>
                            {/if}
                            {#each productos as values}
                            <tr>
                                <td>
                                    <p class="text-sm mb-0"><span class="font-weight-bold">{values.id}</span></p>
                                    
                                </td>
                                <td class="d-none">
                                    <p class=" mb-0"><span class="font-weight-bold">{formatearFecha(values.fecha_actualizacion).fechaFormateada} {formatearFecha(values.fecha_actualizacion).horaFormateada}</span></p>
                                    
                                </td>

                                <td>
                                    <div class="d-flex px-2 py-1">
                                        
                                        <img src="{values.url_imagen}" class="avatar-lg me-3 border-radius-md" alt="img" >
                                        
                                        <div class="d-flex flex-column justify-content-center">
                                            <h5 class="mb-0 text-sm">{values.nombre}</h5>
                                        </div>
                                    </div>
                                </td>
    
                                <td>
                                    <p class="text-sm mb-0"><span class="text-success font-weight-bold">$ {values.precio}  </span></p>
                                    {#if values.is_promocion === true}
                                    <p class="text-sm mb-0">con descuento: <span class="text-warning font-weight-bold">$ {values.precio-values.precio*values.descuento/100}</span></p>
                                    {/if}
                                    
                                </td>
    
                                <td>
                                    
                                    {#if values.is_activo === true}
                                    <p class="text-sm mb-0 text-center mx-5 bg-success border-radius-2xl text-white font-weight-bold">Activo</p>
                                    {:else}
                                    <p class="text-sm mb-0 text-center mx-4 bg-danger border-radius-2xl text-white font-weight-bold">No activo</p>
                                    {/if}
                                    {#if values.is_promocion === true}
                                    <p class="text-sm mt-1 text-center mb-0"><span class="text-success font-weight-bold">En Oferta <span class="text-warning">{Math.trunc(values.descuento)}%</span></span></p>
                                    {:else}
                                    <p class="text-sm mt-1 text-center mb-0"><span class="text-danger font-weight-bold">Sin oferta</span></p>
                                    {/if}
    
                                </td>

                                <td class="text-center">
                                    <p class="text-sm mb-0"><span class="text-dark font-weight-bold">{values.stock}</span></p>
                                </td>
    
                                <td>
                                    <button class="btn mx-1 col-auto btn-sm btn-outline-danger" on:click={() => eliminarProducto(values.id)}>Eliminar</button>
                                    <a class="btn col-auto mx-1 btn-sm btn-outline-success" href={`/producto/${values.id}`}>Editar</a>
                                    <a class="btn col-auto mx-1 btn-sm btn-outline-dark" href={`/entrada/${values.id}`}>Entrada →</a>
                                    {#if values.stock > 0}
                                    <a class="btn col-auto mx-1 btn-sm btn-outline-danger" href={`/salida/${values.id}`}>Salida →</a>
                                    {:else}
                                    <div class="btn col-auto mx-1 btn-sm btn-outline-danger disabled">Salida →</div>
                                    {/if}

                                </td>
                            </tr>
                            {/each}
                            
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    <!-- <Footer/> -->
</main>
