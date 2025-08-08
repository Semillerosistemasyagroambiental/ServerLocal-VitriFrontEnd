<script>
  import { onMount } from "svelte";
  import Swal from "sweetalert2";
  import { fetchWithAuth } from '../api/auth';

  export let id; // ID del producto al que se le hará la entrada.

  let errorMessage = '';

  // Datos del producto (se cargan cuando se hace la petición GET)
  let sku = "";
  let nombre = "";
  let descripcion = "";
  let url_imagen = "";
  let unidad_producto = "";
  let cantidad = 1;
  let stock = 0;

  // Datos para la entrada
  let salidas_cantidad = 1;
  let salidas_estado = "";
  let observacion = "";

  onMount(async () => {
    try {
      // Obtener detalles del producto por su ID
      if (id) {
        const product = await fetchWithAuth(`http://127.0.0.1:5000/api/admin/productos/${id}`);      
        if (product) {
          // Asignar datos del producto para mostrar
          sku = product.sku || "";
          nombre = product.nombre || "";
          descripcion = product.descripcion || "";
          url_imagen = product.url_imagen || "";
          unidad_producto = product.unidad_producto || "";
          cantidad = product.cantidad || 0;
          stock = product.stock || 0;
        }
      }
    } catch (error) {
      console.error("Error:", error.message);  // Asegúrate de imprimir el mensaje de error
    }
  });

  const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = {
    salidas_productos: id,
    salidas_estado: salidas_estado,
    salidas_cantidad: salidas_cantidad,
    observacion: observacion,
    salidas_usuario: 1
  };

  try {
    // Llama a fetchWithAuth y obtiene los datos como JSON si están disponibles
    const data = await fetchWithAuth("http://127.0.0.1:5000/api/admin/salidas", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    // Si `data` es null, significa que la respuesta estaba vacía
    if (data) {
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Entrada creada correctamente",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.href = "/productos";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Respuesta inesperada del servidor",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error al conectar con el servidor",
    });
    console.error("Error:", error);
  }
};

</script>

<main class="row m-0">
<div class="col-12 col-md-8 mx-auto pt-3 mb-4 mb-md-0">
  <div class="row">
      <h4 class="col-12 pt-3">Nueva Salida</h4>
  </div>

  <form on:submit={handleSubmit}>
    <div class="card p-3">
      <!-- Información del Producto -->
      <h3 class="text-center">{nombre} x{cantidad} {unidad_producto}</h3>
      <p class="text-center">Stock actual: {stock}</p>
      
      <div class="row mx-auto pt-3">
        <!-- Cantidad de la Entrada -->
        <div class="col-12 col-md-6">
            <div class="input-group input-group-static my-2">
                <label for="salidas_cantidad">Cantidad de la salida</label>
                <input type="number" class="form-control" bind:value={salidas_cantidad} min="1" required />
            </div>
        </div>

        <div class="col-12 col-md-6">
          <label for="salidas_estado" class="form-label">Motivo de la salida</label>
          <div class="input-group input-group-outline mb-3 mt-n1">
              <select class="form-control" bind:value={salidas_estado} required>
                  <option value="" selected>Seleccionar</option>
                  <option value="DESCOMPUESTO" >DESCOMPUESTO</option>
                  <option value="ROBO" >ROBO</option>
                  <option value="VENCIDO" >VENCIDO</option>
                  <option value="DONACION" >DONACION</option>
                  <option value="ERROR" >ERROR DE DIGITACIÓN</option>
                  
                  <!-- Agrega más opciones según sea necesario -->
              </select>
          </div>
        </div>

        <!-- Observación de la Entrada -->
        <div class="col-12 col-md-8 mx-auto">
            <div class="input-group input-group-static my-2">
              <label for="observacion">Observación (opcional)</label>
              <textarea class="form-control" bind:value={observacion}></textarea>
            </div>
          </div>
          
      </div>

        <!-- Botones de acción -->
        <div class="col-12 text-center mt-4">
          <a href="/productos" class="btn btn-danger">Cancelar</a>
          <button type="submit" class="btn btn-success">Agregar salida</button>
        </div>
    </div>
  </form>
</div>
</main>
