<script>
    import { onMount } from 'svelte';
    import { fetchWithAuth } from '../api/auth';
    import Swal from 'sweetalert2';
    import { getBanners } from '../api/banner';
    import Footer from '../components/Footer.svelte';
    import MenuAcciones from '../components/MenuLateral.svelte';

    let banners = [];
    let errorMessage = '';

    // Cargar banners al montar el componente
    onMount(async () => {
        try {
            banners = await getBanners();
        } catch (error) {
            console.error('Error al cargar banners:', error);
            errorMessage = 'No se pudieron cargar los banners.';
        }
    });

    // Eliminar un banner
    async function eliminarBanner(id_banner) {
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
                await fetchWithAuth(`http://127.0.0.1:5000/api/admin/banner/${id_banner}`, {
                    method: 'DELETE',
                });

                // Actualizar lista de banners
                banners = banners.filter((banner) => banner.id_banner !== id_banner);

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'El banner ha sido eliminado.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Error al eliminar el banner:', error);
            Swal.fire(
                'Error',
                `Hubo un problema al eliminar el banner: ${error.message || error}`,
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
                    <h4 class="col-6 pt-3">Ajustes</h4>
                    <div class="col-6 mt-3 text-end">
                        <a href="/nuevo_banner" class="btn btn-sm btn-success">Agregar banner</a>
                    </div>
                </div>

                
                  <div class="row mx-5">
                    {#each banners as values}
                    <div class="col-6 col-md-3 mb-3">
                        <div class="card">
                            <img class="card-img-top" src="{values.url_imagen}" alt="img" />
                            <p class="text-center">Posicion de la imagen en "Y" {values.posicion_y}</p>
                            
                            <div class="card-body p-0 text-center">
                                <button class="btn btn-danger btn-sm" on:click={() => eliminarBanner(values.id_banner)}>eliminar</button>
                                <a class="btn btn-danger btn-sm" href="/ajustes/{values.id_banner}">editar</a>
                            </div>
                        </div>
                    </div>
                    {/each}
                  </div>
                  
            </div>

        </div>
    </div>
    <Footer/>
</main>
