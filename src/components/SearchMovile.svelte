<script>
    import { onMount } from 'svelte';
    import { tick } from 'svelte';
  
    let searchTerm = '';
    let products = [];
    let filteredProducts = [];
    let showDropdown = false;
    let activeIndex = -1;
    let searchBox;
  
    async function fetchProducts() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/publico/productos'); // Cambia a tu API
        products = await response.json();
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    }
  
    function handleInput(e) {
      searchTerm = e.target.value;
      if (searchTerm) {
        filteredProducts = products.filter(product =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredProducts.length > 0) {
          showDropdown = true;
          activeIndex = 0; // Selecciona automáticamente el primer resultado
        } else {
          showDropdown = false;
        }
      } else {
        showDropdown = false;
      }
    }
  
    function handleSelectProduct(id) {
      window.location.href = `/ver_producto/${id}`;
    }
  
    function handleClickOutside(event) {
      if (!searchBox.contains(event.target)) {
        showDropdown = false;
      }
    }
  
    function handleKeydown(event) {
      if (showDropdown) {
        if (event.key === 'ArrowDown') {
          activeIndex = (activeIndex + 1) % filteredProducts.length;
        } else if (event.key === 'ArrowUp') {
          activeIndex = (activeIndex - 1 + filteredProducts.length) % filteredProducts.length;
        } else if (event.key === 'Enter' && activeIndex >= 0) {
          handleSelectProduct(filteredProducts[activeIndex].id);
        }
      }
    }
  
    onMount(() => {
      fetchProducts();
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    });
  
    $: activeIndex, async () => {
      if (showDropdown && activeIndex !== -1) {
        await tick();
        const activeElement = document.querySelector('.autocomplete-item.active');
        if (activeElement) {
          activeElement.scrollIntoView({ block: 'nearest' });
        }
      }
    };
  </script>
  
  <style>
    .search-wrapper {
      position: relative;
      margin-top: -4px;
    }

    input {
      width: 100%;
        border: 3px solid transparent;
        border-radius: 50px;
        padding-left: 20px;
        color: #707070;
        background-origin: border-box;
        background-clip: padding-box, border-box;
        background-image: linear-gradient(#fff, #fff), /* Fondo blanco interno */
                          linear-gradient(135deg, #050e00ea, #daead2a8, #050e00ea);
        background-size: 200% 200%; /* Hacemos el fondo más grande para animarlo */
        animation: moveGradient 3s linear infinite; /* Animación continua */
    }

    @keyframes moveGradient {
        0% {
        background-position: 0% 50%; /* Inicia desde la esquina superior izquierda */
        }
        50% {
        background-position: 100% 50%; /* Se mueve horizontalmente a la derecha */
        }
    }
    
    input:focus {
        border: 2px solid transparent;
        padding-left: 20px;

        background-origin: border-box;
        background-clip: padding-box, border-box;
        background-image: linear-gradient(#fff, #fff), /* Fondo blanco interno */                        
                          linear-gradient(135deg, #050e00ea, #daead2a8, #050e00ea);
        background-size: 200% 200%; /* Hacemos el fondo más grande para animarlo */
        animation: moveGradient 3s linear infinite; /* Animación continua */
        outline: #000; /* Elimina el borde interno */
        border-radius: 16px 16px 0px 0px; /* Superior izquierdo, Superior derecho, Inferior derecho, Inferior izquierdo */

    }
    
    .autocomplete-list {
      list-style: none; /* Elimina los puntos */
      position: absolute;
      z-index: 1000;
      max-height: 75vh;
      overflow: hidden;
      background-color: #fff;
      overflow-y: auto; /* Habilitar desplazamiento si es necesario */
      width: 100%;
      margin-top: 0px;
      border-radius: 0px 0px 16px 16px; /* Superior izquierdo, Superior derecho, Inferior derecho, Inferior izquierdo */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      color: #000;
      text-align: start;

        border: 2px solid transparent;

        background-origin: border-box;
        background-clip: padding-box, border-box;
        background-image: linear-gradient(#fff, #fff), /* Fondo blanco interno */                        
                          linear-gradient(135deg, #050e00ea, #daead2a8, #050e00ea); /* Degradado verde */
        background-size: 200% 200%; /* Hacemos el fondo más grande para animarlo */
        animation: moveGradient 3s linear infinite; /* Animación continua */
        border-top: 0px;
    }
  
    .autocomplete-item {
      padding: 5px;
      padding-top: 0px;
      cursor: pointer;
      margin-left: 0;
    }
  
    /* Aplicar prioridad al hover para que sobreescriba el resaltado por teclado */
    .autocomplete-item:hover {
      background-color: #f0f2f5;
    }
  
    /* Eliminar conflicto entre hover y el estado activo por teclas de flechas */
    .autocomplete-item.active {
      background-color: #f0f2f5;
      border-left: 4px solid #38a9005d;
      
    }
  
    .autocomplete-item.active:hover {
      background-color: #f0f2f5; /* Prioridad al hover */
    }

    ul{
        padding-left: 0px;
    }

    .color-activo{
        color: #38a900;
        top:2px;
        right: 5px;
        font-size: 17px;
    }
    .color-inactivo{
        color: #ff0000;
        top:2px;
        right: 5px;
        font-size: 17px;
    }
    .color-agotado{
        color: #6f6d6d;
        top:2px;
        right: 5px;
        font-size: 17px;
    }
    
  </style>
  
  <div bind:this={searchBox} class="search-wrapper">
    <input type="text" placeholder="Buscar productos" bind:value={searchTerm} on:input={handleInput} on:keydown={handleKeydown}/>
    
    {#if showDropdown}
      <ul class="autocomplete-list">
        {#each filteredProducts as product, index}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <li class="autocomplete-item {activeIndex === index ? 'active' : ''} position-relative" on:click={() => handleSelectProduct(product.id)}>
            <img class="mt-1" src="{product.url_imagen}" alt="" style="width: 25px; height: 25px; border-radius: 3px ">
            {product.nombre.length >= 18 ? product.nombre.substring(0, 18) + "..." : product.nombre}
            <span class="{product.is_activo? 'color-activo': 'color-inactivo'} {product.stock <= 0 ? 'color-agotado': ''} position-absolute">●</span>
          </li>
        {/each}
      </ul>

      
    {/if}

    
  </div>
  