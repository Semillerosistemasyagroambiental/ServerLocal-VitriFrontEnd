<script>
    import { onMount } from 'svelte';
    import { fetchWithAuth } from '../api/auth';
    import Swal from 'sweetalert2';
    import { getCategorias } from '../api/categorias';
    import Footer from '../components/Footer.svelte';
    import MenuAcciones from '../components/MenuLateral.svelte';

    let categorias = [];
    let errorMessage = '';

    onMount(async () => {
        try {
            categorias = await getCategorias();
        } catch (error) {
            errorMessage = 'No se pudieron cargar las categorias.';
        }
    });

    // eliminar Categorias

   async function eliminarCategoria(id_categorias) {
    try {
        const result = await Swal.fire({
            
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            const response = await fetchWithAuth(`http://127.0.0.1:5000/api/admin/categorias/${id_categorias}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Actualizar la lista de categoria después de la eliminación
                categorias = categorias.filter(categorias =>categorias.id_categorias !== id_categorias);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'La categoria ha sido eliminada.',
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire(
                    'Error',
                    `Hubo un problema al eliminar la categoria: ${response.statusText}`,
                    'error'
                );
            }
        }
    } catch (error) {
        Swal.fire(
            'Error',
            `Hubo un problema al eliminar la categoria: ${error}`,
            'error'
        );
    }
}

</script>

<main>

    <div class="row m-0" style="padding-left: 4.5rem;">
        <MenuAcciones/>
        
        <div class="col" style="min-height: 68vh;">

            
            <div class="col mx-auto">
                <div class="row">
                    <h4 class="col-6 pt-3">Categorias</h4>
                    <div class="col-6 mt-3 text-end">
                        <a href="/categoria/nueva" class="btn btn-sm btn-success">Agregar categoria</a>
                    </div>
                </div>

                
                  
                  

                <div class="table-responsive card">
                    <table class="table align-items-center mb-0">
                        <thead>
                            <tr>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7">
                                    id</th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                    Nombres</th>
                                
                                <th
                                    class="text-uppercase text-secondary text-xxs font-weight-bolder text-center opacity-7">
                                    acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each categorias as values}
                            <tr>
                                <td>
                                    <p class="mb-0 text-xs text-center">{values.id_categorias}</p>
                                </td>
                                <td>
                                    <div class="d-flex px-2 py-1">
                                        <div>
                                            <img src="{values.url_imagen}" alt="img" class=" avatar-xs me-3">
                                        </div>
                                        <div class="d-flex flex-column justify-content-center">
                                            <h6 class="mb-0 text-xs">{values.nombre}</h6>
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle text-center">
                                    <a class="btn btn-sm btn-outline-success" href={`/categoria/${values.id_categorias}`}>Editar</a>
                                    <button class="btn btn-sm btn-outline-danger" on:click={() => eliminarCategoria(values.id_categorias)}>Eliminar</button>
                                    
                                </td>
                            </tr>
                            {:else}
                            <tr>
                                <td class="text-center">
                                    No se encontraron categorias  
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
