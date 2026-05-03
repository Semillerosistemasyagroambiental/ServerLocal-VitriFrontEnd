<script>
  import { onMount } from 'svelte';

  import Menufooter from './components/menufooter.svelte';
  import Nav from './components/nav.svelte';
  import Header from './components/header.svelte';
  import Category from './components/category.svelte';
  import Car from './components/ModalCarrito.svelte';
  import { selectedCategory } from './stores/stores';
  import { cart, addToCart, incrementQuantity, decrementQuantity } from './stores/cart';

  import Card from './components/card.svelte';
  import Sliderly from './components/Sliderly.svelte';
  import BtnAnuncio from './components/BtnAnuncio.svelte';
  import ModalAnuncio from './components/ModalAnuncio.svelte';
  import Footer from './components/Footer.svelte';

  let categorias = [];

  // Accesos rápidos
  let clasesCard = "col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2 col-xxl-2 mb-3 px-2";

  // Llamar a la API
  onMount(async () => {
    try {
      // Obtener productos
      const responseProductos = await fetch("https://vitri-api.ocloudev.lat/api/publico/productos");
      listProductos = await responseProductos.json();
      
      // Obtener categorías
      const responseCategorias = await fetch("https://vitri-api.ocloudev.lat/api/publico/categorias");
      categorias = await responseCategorias.json();
      
    } catch (error) {
      console.error('Error al obtener productos o categorías:', error);
    }
  });

  // Filtrar productos por categoría seleccionada
  $: filteredProducts = $selectedCategory === 'all'
    ? listProductos
    : listProductos.filter(producto => {
        const categoria = categorias.find(cat => cat.nombre === $selectedCategory);
        return categoria ? producto.id_categorias === categoria.id_categorias : false;
      });

  // Filtrar categorías que tienen productos filtrados
  $: categoriasConProductos = categorias.filter(categoria =>
    filteredProducts.some(producto => producto.id_categorias === categoria.id_categorias)
  );

  // Verificar si hay productos en promoción
  $: productosEnPromocion = filteredProducts.filter(producto => producto.is_activo && producto.is_promocion && producto.stock > 0);
  $: productosAnunciados = filteredProducts.filter(producto => producto.anunciar && producto.is_activo);
  $: productosNoactivos = filteredProducts.filter(producto => producto.is_activo === false);


  // Verificar si hay productos después del filtrado
  $: noProducts = filteredProducts.length === 0;

  let listProductos = []; // Aquí obtienes tu lista de productos

  // Lógica para obtener productos desde API u otra fuente
  onMount(async () => {
    try {
      const responseProductos = await fetch("https://vitri-api.ocloudev.lat/api/publico/productos");
      listProductos = await responseProductos.json();
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  });

  // Función para agregar al carrito desde Home.svelte
  function handleAddToCart(producto) {
    addToCart(producto);
  }

  // Función para obtener la cantidad del producto directamente desde localStorage 🌟🌟🌟
  function cantidadProductoEnHistorial(productoId) {
    const historial = JSON.parse(localStorage.getItem('historial_pedido')) || {};
    return historial[productoId] || 0; // Devuelve 0 si el producto no existe en el historial
  }


</script>

<main>
    
    <Nav/>
    <Header/>
    
    <div class="mx-0 mb-4">
      {#if productosEnPromocion.length > 0 }
        <div class="row my-2 mx-2 pb-1 mx-md-2 mx-md-5">
          <img class="ms-n2 mt-n1" src="/img/icon/star.png" alt="🌟" style="width: 53px; height: 28px">
          <h5 class="col my-auto text-dark ms-n3">Ofertas</h5>
          <a href="/ofertas" class="col-auto my-auto text-end ms-n3 btn-sm btn mt-n1 p-1 px-2" style="background-color: #ffed00;"><span class=" text-dark">Ver todas → </span></a>
        </div>

      <Sliderly/>

      {/if}
    </div>
    
    <Car/>
    <ModalAnuncio/>

    <div class="card-body mx-3 mx-md-5">

      <Category/>

      {#if noProducts}
        <div class="text-center my-5">
          <img class="opacity-4" src="./img/unavailable_icon.webp" alt="No products available" style="width: 50px; height: auto;">
          <p class="text-muted mt-3">No hay productos disponibles en esta categoría.</p>
        </div>
      {/if}

      <!-- Mostrar productos juntos cuando se selecciona "Todos" -->
      {#if $selectedCategory === 'all'}
        {#if filteredProducts.some(producto => producto.is_activo === true && producto.stock > 0)}
          <div class="row my-2 mt-3">
            <span class="material-symbols-outlined text-dark my-auto col-auto">
              dashboard
              </span>
            <h5 class="col-auto my-auto text-dark ms-n3 border-end border-2">Disponibles</h5>
            <hr class="bg-gray-600 opacity-1 col mt-3 me-2" style="padding-top: 1.7px ;">
          </div>
          {/if}
        <div class="row my-2">
          {#each filteredProducts as producto (producto.id)}
            {#if producto.is_activo === true && producto.stock > 0}
              <div class="{clasesCard} {cantidadProductoEnHistorial(producto.id) >= producto.max_usuario && producto.max_usuario > 0 ? 'order-last' : ''}">
                <Card {producto} addToCart={handleAddToCart}/>
              </div>
            {/if}
          {/each}
        </div>
      {/if}

      <!-- Mostrar productos agrupados por categoría cuando no es "Todos" -->
      {#if $selectedCategory !== 'all'}
        {#each categoriasConProductos as categoria}
          <div class="row my-2 mt-3">
            <img class="sin-fondo" src="{categoria.url_imagen}" alt="" style="width: 60px;">
            <h5 class="col-auto my-auto text-dark ms-n3">{categoria.nombre}</h5>
            <hr class="bg-gray-600 opacity-1 col mt-3 me-2" style="padding-top: 1.7px ;">
          </div>
          <div class="row my-2">
            {#each filteredProducts as producto (producto.id)}
              {#if producto.id_categorias === categoria.id_categorias && producto.is_activo === true && producto.stock > 0}
                <div class="{clasesCard} {cantidadProductoEnHistorial(producto.id) >= producto.max_usuario && producto.max_usuario > 0 ? 'order-last' : ''}">
                  <Card {producto} addToCart={handleAddToCart}/>
                </div>
                {:else}
              <!-- <div class="text-center my-2">
                <img class="opacity-4" src="./img/unavailable_icon.webp" alt="No products available" style="width: 50px; height: auto;">
                <p class="text-muted mt-3">No hay productos disponibles en esta categoría.</p>
              </div> -->
              {/if}
              
            {/each}
          </div>
        {/each}


      {/if}
      
      {#if filteredProducts.some(producto => producto.stock <= 0 && producto.is_activo === true)}
      <div class="row my-2">
        <span class="material-symbols-outlined text-dark my-auto col-auto">
          update
          </span>
        <h5 class="col-auto my-auto text-dark ms-n3 border-end border-2">Disponibles pronto</h5>
        <hr class="bg-gray-600 opacity-1 col mt-3 me-2" style="padding-top: 1.7px ;">
      </div>
      {/if}
      <div class="row">
        {#each filteredProducts as producto (producto.id)}
        {#if producto.stock <= 0 && producto.is_activo === true}

            <div class="{clasesCard}">
              <Card {producto} addToCart={handleAddToCart}/>
            </div>
            {/if}

        {/each}
      </div>
    </div>

    {#if productosAnunciados.length > 0 }
      <BtnAnuncio/>
    {/if}

      <Menufooter/>
    

    <Footer/>
</main>

<style>
  .sin-fondo{
    filter: brightness(1.1);
    mix-blend-mode: multiply;
  }
</style>