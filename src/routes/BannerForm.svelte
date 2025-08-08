<script>
    import { onMount } from "svelte";
    import Swal from "sweetalert2";
    import { fetchWithAuth } from '../api/auth.js'; // Asegúrate de importar la función correctamente
    
    export let id;

    // DATOS
    let posicion_y = '';
    let url_imagen = '';

    onMount(async () => {
      try {

        // Si hay un id, obtener detalles del producto (ya como JSON)
        if (id) {
          const producto = await fetchWithAuth(`http://127.0.0.1:5000/api/admin/banner/${id}`);
          if (producto) {

            posicion_y = producto.posicion_y;
            url_imagen = producto.url_imagen;
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });
  
    const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      posicion_y,
      url_imagen,
    };

    try {
      const method = id ? "PATCH" : "POST";
      const url = id
        ? `http://127.0.0.1:5000/api/admin/banner/${id}`
        : "http://127.0.0.1:5000/api/admin/banner";

      // Usar fetchWithAuth en lugar de fetch
      const data = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Categoria guardada correctamente',
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.href = '/ajustes'; // Redirigir a la lista de ajustes
      });

    } catch (error) {
      // Mostrar mensaje de error en caso de fallo
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar el producto',
      });
    }
  };
  </script>
  
  <main class="container">
    <div class="row mx-auto">
      <div class="col-12 mx-auto col-md-6 pt-3 mb-4 mb-md-0">
        <form on:submit={handleSubmit}>
          <div class="card p-3">
            <h3 class="text-center">Agregar Banner</h3>
            <div class="row mx-auto pt-3">
              
  
              <div class="col-12 col-md-6">
                <div class="input-group  input-group-static my-2">
                    <h6 class="">Posicion en "Y"</h6>
                    <input type="number" class="form-control mt-n3" bind:value={posicion_y} />
                </div>
            </div>

            <div class="col-12 col-md-6">
                <div class="input-group  input-group-static my-2">
                    <h6 class="">Link Imagen</h6>
                    <input type="text" class="form-control mt-n3" bind:value={url_imagen} />
                </div>
            </div>

  
              <div class="col-12 text-center">
                <a href="/ajustes" class="btn btn-danger">Cancelar</a>
                <button class="btn btn-success" type="submit">Guardar</button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="col-6 mx-auto col-md-6 mb-3">
        <div class="card">
            <img class="card-img-top" src="{url_imagen}" alt="img" />
        </div>
      </div>
    </div>
    
  </main>

  