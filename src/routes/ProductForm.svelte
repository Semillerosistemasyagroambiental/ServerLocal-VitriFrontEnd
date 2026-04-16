<script>
  import { onMount } from "svelte";
  import Swal from "sweetalert2";
  import { fetchWithAuth } from '../api/auth';
  import { getCategorias } from '../api/categorias';
    import ProteccionAdmi from "../components/ProteccionAdmi.svelte";

  export let id; // Si existe, es edición. Si no, es creación.

  let categorias = [];
  let errorMessage = '';

  // DATOS
  let sku = "";
  let nombre = "";
  let descripcion = "";
  let url_imagen = "";
  let url_ficha_tecnica = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcLqnQ1cYNxL6xE6_cEknAlHFXDPQTKnpcHQ&s";
  let unidad_producto = "";
  let cantidad = 1;
  let max_usuario = 1;
  let precio = 0;
  let is_promocion = false;
  let descuento = 10;
  let stock = 0;
  let is_activo = true;
  let id_categorias = 0;
  let anunciar = false;
  let fecha_inicio_descuento = null;
  let fecha_fin_descuento = null;

  onMount(async () => {
    try {
      categorias = await getCategorias();

      // Si hay un id, obtener detalles del producto (ya como JSON)
      if (id) {
        const product = await fetchWithAuth(`http://127.0.0.1:5000/api/admin/productos/${id}`);      
        if (product) {

          sku = product.sku || "";
          nombre = product.nombre || "";
          descripcion = product.descripcion || "";
          url_imagen = product.url_imagen || "";
          url_ficha_tecnica = product.url_ficha_tecnica || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcLqnQ1cYNxL6xE6_cEknAlHFXDPQTKnpcHQ&s";
          unidad_producto = product.unidad_producto || "";
          cantidad = product.cantidad || 0;
          max_usuario = product.max_usuario || 0;
          precio = product.precio || 0;
          is_promocion = product.is_promocion || false;
          descuento = product.descuento || 0;
          stock = product.stock || 0;
          is_activo = product.is_activo || true;
          id_categorias = product.id_categorias || 0;
          anunciar = product.anunciar || false;
          fecha_inicio_descuento = convertirFechaDatetimeAFecha(product.fecha_inicio_descuento) || null;
          fecha_fin_descuento = convertirFechaDatetimeAFecha(product.fecha_fin_descuento) || null;
          console.log(product)
        }
      }
    } catch (error) {
      console.error(errorMessage, error.message);  // Asegúrate de imprimir el mensaje de error
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      sku,
      nombre,
      descripcion,
      url_imagen,
      url_ficha_tecnica,
      unidad_producto,
      cantidad,
      max_usuario,
      precio,
      is_promocion,
      descuento,
      stock,
      is_activo,
      id_categorias,
      anunciar,
      fecha_inicio_descuento,
      fecha_fin_descuento,
    };

    try {
      const method = id ? "PATCH" : "POST";
      const url = id
        ? `http://127.0.0.1:5000/api/admin/productos/${id}`
        : `http://127.0.0.1:5000/api/admin/productos`;

      // Usar fetchWithAuth en lugar de fetch
      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData),
      });

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Producto guardado correctamente",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.href = "/productos";// Redirigir a la lista de productos
      });

    } catch (error) {
      // Mostrar mensaje de error en caso de fallo
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al guardar el producto",
      });
    }
  };



  // FUNCION DE CONVERSIÓN DE FECHAS 🌟🌟🌟

  function convertirFechaDatetimeAFecha(fechaDatetimeStr) {
    // Convertir la cadena de datetime a un objeto Date
    const fecha = new Date(fechaDatetimeStr);

    // Verificar si la fecha es válida
    // if (isNaN(fecha)) {
    //     throw new Error("Fecha inválida");
    // }

    // Obtener el día, mes y año
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses comienzan desde 0
    const año = fecha.getFullYear();

    // Retornar la fecha en formato dd/mm/yyyy
    return `${año}-${mes}-${dia}`;
}

// Función que maneja el error de la imagen
function manejarErrorImagen(event) {
  event.target.src = "/img/carrito-vacio.png"; // Cambiar a la imagen alternativa
}

// Función para mostrar la alerta
function showAlert() {
        Swal.fire({
            title: '¡Indicaciones!',
            html: '<p>Dirigete a la pagina y selecciona la imagen a subir:</p><img class="w-50" src="/img/guia1.png" alt="guia1"><p>Espera que cargue la imagen y copia la URL que dice "Enlace directo"</p><img class="w-80" src="/img/guia3.png" alt="guia1"><p>luego vuelve y pega la URL copiada</p><a class="btn btn-success" href="https://postimages.org/" target="_blank">ir a la pagina</a>',
            showConfirmButton: false,
            showCloseButton: true, // Muestra un botón de cerrar
        });
    }
</script>

<main class="container">

  <ProteccionAdmi/>
  <div class="row mx-auto">
    <div class="col-12 col-md-9 {is_activo ? '' : 'mx-auto'} pt-3 mb-4 mb-md-0">
      <form on:submit={handleSubmit}>
        <div class="card p-3">
          
          <h3 class="text-center">{id ? "Editar Producto" : "Guardar Producto"}</h3>
          
          <div class="row mx-auto pt-3">
            <div class="col-auto">
              <div class="text-center  {is_activo === true ? 'activo': 'border' } p-2 border-radius-2xl">
                <span class="">Activo? {is_activo === true ? 'Si': 'No' }</span>
                <div class="form-check form-switch ms-4 mb-3">
                  <input type="checkbox" class="form-check-input" bind:checked={is_activo} />
                </div>
              </div>
            </div>
            <div class="col-7 col-md-4 {id ? 'd-none' : ''}">
              <div class="input-group input-group-static my-2">
                <label for="sku">SKU</label>
                <input type="text" class="form-control" bind:value={sku} required={!id} />
              </div>
            </div>
  
            <div class="col-12 col-md-6 {id ? "col-md-10" : ""}">
              <div class="input-group input-group-static my-2">
                <label for="nombre">Nombre</label>
                <input type="text" class="form-control" bind:value={nombre} required />
              </div>
            </div>
  
            <div class="col-12 col-md-6">
              <div class="input-group input-group-static my-2">
                <label for="descripcion">Descripción</label>
                <textarea class="form-control" bind:value={descripcion} required></textarea>
              </div>
            </div>
  
            <div class="col-12 col-md-6 my-auto">
              <div class="input-group input-group-static my-2">
                <label class="col-12" for="url_imagen">URL de Imagen</label>
                <div class="row col-12 ">
                  <div class="col-9">
                    <input type="url" class="form-control" bind:value={url_imagen} required />
                  </div>
                  <div class="col-3 my-auto">
                    <div class="btn btn-sm btn-outline-success mt-n3" on:click={showAlert}>subir nueva</div>

                  </div>
                </div>
               
              </div>
            </div>
  
            <div class="col-12 col-md-6">
              <div class="input-group input-group-static my-2">
                <label for="url_ficha_tecnica">URL Ficha Técnica</label>
                <input type="url" class="form-control" bind:value={url_ficha_tecnica} />
              </div>
            </div>
            
            <div class="col-12 col-md-3">
              <div class="input-group input-group-static my-2">
                <label for="cantidad">Cantidad de unidad</label>
                <input type="number" class="form-control" bind:value={cantidad} required />
              </div>
            </div>
  
            <div class="col-12 col-md-3">
              <label for="unidad_producto" class="form-label">Unidad de medida</label>
              <div class="input-group input-group-outline mb-3 mt-n1">
                  <select class="form-control" bind:value={unidad_producto} required disabled={stock ? true : false}>
                      <option value="" selected>Seleccionar</option>
                      <option value="KG" >Kilogramo</option>
                      <option value="GR" >Gramo</option>
                      <option value="L" >Litro</option>
                      <option value="ML" >Mililitro</option>
                      <option value="UND" >Unidad</option>
                      
                      <!-- Agrega más opciones según sea necesario -->
                  </select>
              </div>
            </div>
  
            <div class="col-12 col-md-3">
              <div class="input-group input-group-static my-2">
                <label for="precio">Precio</label>
                <input type="number" class="form-control" bind:value={precio} required />
              </div>
            </div>
  
            <div class="col-auto">
              <div class="border-radius-2xl {is_promocion === true ? 'activo': 'border' } p-2">
                <span>Decuento?</span>
                <div class="form-check form-switch"><span class="ms-2">{is_promocion === true ? 'Si': 'No' }</span> 
                  <input type="checkbox" class="form-check-input" bind:checked={is_promocion} />
                </div>
              </div>
            </div>
  
            <div class="col-6 col-md-2 {is_promocion === false ? 'd-none': '' }">
              <div class="input-group input-group-static my-2">
                <label for="descuento">% Descuento</label>
                <input type="number" placeholder="cuanto es el % ?" class="form-control" bind:value={descuento} />
              </div>
            </div>
  
            <div class="col-12 col-md-6">
              <label for="id_categorias" class="form-label">Categoría</label>
              <div class="input-group input-group-outline mb-3 mt-n2">
                  <select class="form-control" bind:value={id_categorias} required>
                    {#each categorias as item}
                    <option value={item.id_categorias}>{item.nombre}</option>
                    {/each}
                  </select>
              </div>
            </div>
  
            <div class="col-12 col-md-3 d-none">
              <div class="input-group input-group-static my-2">
                <label for="stock">Stock</label>
                <input type="number" class="form-control" disabled bind:value={stock} required />
              </div>
            </div>
  
            <div class="col-12 col-md-3">
              <div class="input-group input-group-static my-2">
                <label for="stock">Límite por usuario</label>
                <input type="number" class="form-control" bind:value={max_usuario} required />
              </div>
            </div>
  
            <div class="col-auto">
              <div class="border-radius-2xl {anunciar === true ? 'anunciar': 'border' } p-2">
                <span>Anunciar?</span>
                <div class="form-check form-switch"><span class="ms-2">{anunciar === true ? 'Si': 'No' }</span> 
                  <input type="checkbox" class="form-check-input" bind:checked={anunciar} />
                </div>
              </div>
            </div>

            <!-- <div class="row">
              <div class="col-12 col-md-6">
                <div>
                  <label for="fecha_inicio_descuento" class="form-label ms-n1 ps-1">Inicio Descuento</label>
                  <input type="date" class="form-control" bind:value={fecha_inicio_descuento} />
                </div>
              </div>
    
              <div class="col-12 col-md-6">
                <div>
                  <label for="fecha_fin_descuento" class="form-label">Fin Descuento</label>
                  <input type="date" class="form-control" bind:value={fecha_fin_descuento} />
                </div>
              </div>
            </div> -->
  
            <div class="col-12 text-center mt-4">
              <a href="/productos" class="btn btn-danger">cancelar</a>
              <button type="submit" class="btn btn-success">{id ? "Actualizar Producto" : "Guardar Producto"}</button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="col-md-3 {is_activo ? '' : 'd-none'}  pt-3">
      <div class="card bg-gray {is_activo ? '' : 'bg-gray-200 '} position-relative">
    
        {#if is_promocion === true && is_activo === true}
            <span class="bg-success opacity-9 col-6 col-sm-4 text-white text-center position-absolute" style="z-index: 3; border-radius: 10px 0px 20px 0px;">
              - {Math.trunc(descuento)}%
            </span>
        {/if}
    
        {#if stock === 0 && is_activo === true}
            <span class="bg-gray-600 col-7 col-sm-6 text-white text-center position-absolute" style="z-index: 3; border-radius: 10px 0px 20px 0px;">
            Agotado
            </span>
        {/if}
    
        
        <div class="card-header p-0 position-relative z-index-2" style="border-radius: 0.75rem 0.75rem 0px 0px">
          <div class="d-block blur-shadow-image cursor-pointer img-marco" >
            <a href="{`/ver_producto/${id}`}">
              <img src="{url_imagen ? url_imagen : '/img/sin-productos.webp'}" width="100%" height="170vh" alt="producto" class="border-bottom img-size {is_promocion ? 'img-oferta' : 'img'} {is_activo ? '' : 'img-no-activo'}" style="border-radius: 0.75rem 0.75rem 0px 0px"
              on:error={manejarErrorImagen}>
            </a>
            
          </div>
          <div class="blur opacity-9 col-8 col-sm-6 text-dark text-center position-absolute" style="z-index: 3; border-radius: 7px 0px 0px 0px; bottom: 1px; right: 1px; height: 20px; font-size: 15px;">
            stock {Math.trunc(stock)}
          </div>   
          
    
          <div class="colored-shadow" style="background-image: url(&quot;{url_imagen}&quot;);"></div>
        </div>
        <div class="px-2 py-0">
          <p class="text-dark text-center nombre mt-1 mb-0">{nombre.length >= 15 ? nombre.substring(0, 15) + "..." : nombre}</p>
          <div class="row justify-space-between text-center">
            <div class="col-12 mt-n1 mb-n1">
              <span class="badge border border-1 text-dark justify-space-between" style="font-size: 10px;">x {cantidad} {unidad_producto}</span>
            </div>
          </div>
          {#if is_promocion === true && is_activo === true} 
            <div class="text-warning text-center border-bottom border-gray mt-1 mb-3 pb-2">
              <del class="text-underline text-start text-dark opacity-9 " style="font-size: 12px;left: 14px;" >$ {precio}</del>
              ${precio-precio*descuento/100}
            </div>
            {:else}
            <p class="text-success text-center border-bottom border-gray mt-1 mb-3 pb-2">$ {precio}</p>
          {/if}

          
    
          
          <div class="row text-center mt-2">
            <p class="col mt-n3 my-0" style="font-size: 13px;">
              {#if stock > 0}
                {#if max_usuario === 0}
                Sin limite♾️ 
                {:else}
                  Límite {max_usuario}/{max_usuario} 
                {/if}
    
              {:else}
                Stock en 0
              {/if}
            </p>
            <div class="col-md-10 col-12 mx-auto">

              {#if is_activo === true && stock > 0}
              <button class="btn col-12 btn-sm btn-success">Agregar</button>
              {:else}
              <button class="btn col-12 btn-sm bg-info text-white invalid disabled">Agotado</button>
              {/if}

            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
  
</main>

<style>
  .anunciar{
    border: 2px solid #bd46ff;
    color: #bd46ff;
  }

  .activo{
    border: 2px solid #39a900;
    color: #39a900;
  }
</style>