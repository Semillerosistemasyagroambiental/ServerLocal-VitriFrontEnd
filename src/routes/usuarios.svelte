<script>
    import { onMount } from 'svelte';
	import Footer from '../components/Footer.svelte';
    import MenuAcciones from '../components/MenuLateral.svelte';
    import { eliminarUsuario } from '../api/usuarios';
    import { getUsuarios } from '../api/usuarios';

    // Importamos las librerías de DataTables
    import jQuery from 'jquery';
    import 'datatables.net-dt';

    let usuarios = [];
    let errorMessage = '';

    onMount(async () => {
        try {
            usuarios = await getUsuarios();
        } catch (error) {
            errorMessage = 'No se pudieron cargar los usuarios.';
        }
    });
    

    onMount(() => {
        const tableInterval = setInterval(() => {
            if (usuarios.length > 0) {
                jQuery('#tablaUsuarios').DataTable({
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

</script>


<main>

        <div class="row m-0" style="padding-left: 4.5rem;">

            <MenuAcciones/>

            <div class="col mt-3">
                <div class="row">
                    <h4 class="col-6 pt-3">Usuarios</h4>
                    <div class="col-6 mt-3 text-end">
                        <a href="/usuario/nuevo" class="btn btn-sm btn-success">Agregar usuario</a>
                    </div>
                </div>
                <div class="card p-2 pb-0">
                    <div class="table-responsive">
                        <table id="tablaUsuarios" class="table align-items-center mb-0">
                            <thead>
                                <tr>
                                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Nombres y Apellidos</th>
                                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Rol</th>
                                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Correo</th>
                                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Identifiación</th>
                                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Teléfono</th>
                                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Acciones</th>


                                </tr>
                            </thead>
                            <tbody>
                                {#if usuarios.length === 0}
                                <tr><td class="text-center"><p>No hay usuarios disponibles.</p></td></tr>
                                {/if}
                                {#each usuarios as values}
                                <tr>
                                    <td class="text-center">
                                        <p class="text-sm mb-0">{values.nombres}</p>
                                        <p class="text-sm mb-0">{values.apellidos}</p>
                                    </td>
        
                                    <td class="text-center">
                                        {#if values.rol === 'ADMIN'}
                                        <p class="text-sm text-danger font-weight-bolder mb-0">{values.rol}</p>
                                        {:else}
                                        <p class="text-sm mb-0">{values.rol}</p>
                                        {/if}
                                    </td>

                                    <td class="text-center">
                                        <p class="text-sm mb-0">{values.email}</p>
                                    </td>

                                    <td class="text-center">
                                        <p class="text-sm mb-0">{values.tipo_identificacion} - {values.identificacion}</p>
                                    </td>

                                    <td class="text-center">
                                        <p class="text-sm mb-0">{values.telefono}</p>
                                    </td>

                                    <td class="align-middle pb-0 text-center">
                                        <button class="btn btn-sm btn-outline-danger" on:click={() => eliminarUsuario(values.id_usuarios)}>Eliminar</button>
                                        <a class="btn btn-sm btn-outline-success" href={`/usuario/editar/${values.id_usuarios}`}>Editar</a>
                                    </td>

                                </tr>
                                {/each}
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
</main>

<style>
    main{
        background-color: #f5f5f5;
    }
</style>