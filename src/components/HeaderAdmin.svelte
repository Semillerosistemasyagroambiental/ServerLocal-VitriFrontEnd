<script>
  import { onMount } from 'svelte';
  import { fetchWithAuth } from '../api/auth'; // Verifica que la ruta sea correcta

  let photos = [];
  let currentIndex = 0;
  let currentPhoto = '';
  let backgroundStyle = '';

  // Función para cambiar la foto actual cada 10 segundos
  function changePhoto() {
      currentIndex = (currentIndex + 1) % photos.length;
      const { url_imagen, posicion_y } = photos[currentIndex];
      currentPhoto = url_imagen;
      backgroundStyle = `background-image: url("${currentPhoto}"); background-position-y: ${posicion_y}%; background-size: cover; background-position-x: 1%;`;
  }

  // Fetch para obtener las categorías y sus URLs de las imágenes
  async function getBanner() {
      try {
          const response = await fetch('http://127.0.0.1:5000/api/publico/banner');
          const data = await response.json();

          // Suponiendo que el JSON tiene una estructura como: [{url_imagen: 'ruta1', posicion_y: 80}, {url_imagen: 'ruta2', posicion_y: 50}, ...]
          photos = data;
          if (photos.length > 0) {
              const { url_imagen, posicion_y } = photos[0];
              currentPhoto = url_imagen;
              backgroundStyle = `background-image: url("${currentPhoto}"); background-position-y: ${posicion_y}%; background-size: cover; background-position-x: 50%;`;
          }
      } catch (error) {
          console.error('Error al obtener las fotos:', error);
      }
  }

  // Establecer el intervalo al montar el componente
  onMount(() => {
      getBanner();
      const interval = setInterval(changePhoto, 5000);

      // Limpiar el intervalo cuando se desmonte el componente
      return () => clearInterval(interval);
  });
</script>

<header class="bg-gradient-dark border-radius-2xl">
  <div class="page-header height-responsive border-radius-2xl" style={backgroundStyle}>
    <span class="mask bg-gradient-dark opacity-3"></span>

  </div>
</header>


<style>
  .height-responsive {
    min-height: 25vh !important;
  }

  @media (min-width: 768px) {
    .height-responsive {
    min-height: 40vh !important;
  }
  }
</style>