
<script>
  import { onMount, afterUpdate } from 'svelte';
  import '@splidejs/splide/dist/css/splide.min.css';
  import Splide from '@splidejs/splide';

  let listProductos = [];
  let splide;
  let fechaConvertida;

  onMount(async () => {
    try {
      // Obtener productos desde API
      const responseProductos = await fetch("http://127.0.0.1:5000/api/publico/productos");
      listProductos = await responseProductos.json();

      // Asegurarse de que el array de productos no esté vacío
      if (listProductos.length > 0) {
        // Obtener el campo 'fecha_inicio_descuento' del primer producto
        const fechaInicioDescuento = listProductos[0].fecha_inicio_descuento;

        // Convertir la fecha usando la función de conversión
        fechaConvertida = convertirFechaDatetimeAFecha(fechaInicioDescuento);
      }

    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  });

  afterUpdate(() => {
    if (listProductos.length > 0 && !splide) {
      // Inicializa Splide sólo después de que los productos estén disponibles
      splide = new Splide('.splide', {
        type   : 'loop',
        perPage: 1,
      }).mount(); // Monta Splide

      // Función para simular el clic en "next" cada 3 segundos
      setInterval(() => {
        splide.go('>'); // Avanza al siguiente slide
      }, 10000); // Cambiar de slide cada 3 segundos
    }
  });

  import { isModalOpenAnuncios } from "../stores/modalStore.js";
    import Stock from './graficos/Stock.svelte';

  function handleClickOutside(event) {
    if (event.target.classList.contains("modal")) {
      isModalOpenAnuncios.set(false); // Cierra el modal
    }
  }

  // FUNCION DE CONVERSIÓN DE FECHAS 🌟🌟🌟

  function convertirFechaDatetimeAFecha(fechaDatetimeStr) {
    // Convertir la cadena de datetime a un objeto Date
    const fecha = new Date(fechaDatetimeStr);

    // Array con los nombres de los meses
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    // Obtener el día, mes y año
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = meses[fecha.getMonth()]; // Obtener el nombre del mes a partir del array
    const año = fecha.getFullYear();

    // Retornar la fecha en formato dd/mm/yyyy
    return `${dia} de ${mes}`;
  }
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="modal" class:open={$isModalOpenAnuncios} on:click={handleClickOutside} role="dialog" aria-modal="true">

  <style>
    .cls-1 {
      fill: #1a1a1a;
      opacity: .54;
    }

    .cls-2_oferta {
      font-family: MyanmarText-Bold, 'Myanmar Text';
      font-size: 41.11px;
      font-weight: 700;
      letter-spacing: -.07em;
    }

    .cls-2_oferta, .cls-3 {
      fill: #1d1d1b;
    }

    .cls-5, .cls-6, .cls-7 {
      fill: #fff;
    }

    .cls-4_circulo{
      fill: #39a900;
    }

    .cls-3 {
      font-family: MyriadPro-Regular, 'Myriad Pro';
      font-size: 10.5px;
    }

    .cls-8 {
      fill: #f2e500;
    }

    .cls-9 {
      letter-spacing: 0em;
    }

    .cls-5 {
      font-family: ArialRoundedMTBold, 'Arial Rounded MT Bold';
    }

    .cls-5, .cls-6 {
      font-size: 39.48px;
    }

    .cls-6 {
      font-family: Rockwell, Rockwell;
    }

    .cls-10 {
      fill: #39a900;
    }

    .cls-11 {
      fill: #ffec00;
    }

    .cls-12 {
      clip-path: url(#clippathAnuncio);
    }

    .cls-7 {
      font-family: GoudyOldStyleT-Regular, 'Goudy Old Style';
      font-size: 90px;
      stroke: #fff;
      stroke-miterlimit: 10;
      stroke-width: 2px;
    }

    #Capa_1-2{
      fill: #39a900;
    }

    .cls-13 {
      letter-spacing: .01em;
    }

    .cls-14 {
      letter-spacing: -.01em;
    }

    .cls-15 {
      letter-spacing: 0em;
    }
  </style>

  <div class="modal-content">
    <div class="col">
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="close position-absolute text-center" on:click={() => isModalOpenAnuncios.set(false)}>&times;</div>
    </div>
    <div class="splide ">
      <div class="splide__track">
        <ul class="splide__list">
          {#each listProductos as values}
          {#if values.is_activo === true && values.anunciar === true}
              <li class="splide__slide">
                <a href="{`/ver_producto/${values.id}`}">
                  <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1394 929">
                    <defs>
                      
                      <clipPath id="clippathAnuncio">
                        <path d="M1.43,18.86v840.58c0,9.22,7.47,16.69,16.69,16.69h1183.99c9.22,0,16.69-7.47,16.69-16.69V18.86c0-9.22-7.47-16.69-16.69-16.69H18.13C8.91,2.17,1.43,9.64,1.43,18.86ZM901.5,757.56s-45.87.55-107.25,12.14c-61.38,11.59-132.23-11.08-89.46-60.36,42.76-49.28,262.06,50.6,196.72,48.22ZM901.71,664.39c-3.85-.19-8.02-1.09-12.14-2.5-20.08-6.89-10.74-37.33,9.78-31.89,25.6,6.78,55.26,24.35,55.35,29.33.18,10.09-35.67,5.92-53,5.06ZM961.83,268.27c14.38-45.26,76.82-59.4,63.7,4.31-13.12,63.71,35.03,167.89,1.37,124.64-21.75-27.94-79.45-83.69-65.07-128.95ZM1065.41,547.94c-7.1,6.62-36.38-29.58-47.43-43.58-11.05-14-8.05-36.54,2.69-41.55,8.71-4.06,25.07,23.4,30.94,33.91,1.43,2.57,2.73,5.19,3.88,7.85,4.46,10.32,15.67,38,9.92,43.36Z"/>
                      </clipPath>
                    </defs>
                    <g id="Capa_1-2" data-name="Capa_1">
                      <g>
                        <path d="M1.43,18.86v840.58c0,9.22,7.47,16.69,16.69,16.69h1183.99c9.22,0,16.69-7.47,16.69-16.69V18.86c0-9.22-7.47-16.69-16.69-16.69H18.13C8.91,2.17,1.43,9.64,1.43,18.86ZM901.5,757.56s-45.87.55-107.25,12.14c-61.38,11.59-132.23-11.08-89.46-60.36,42.76-49.28,262.06,50.6,196.72,48.22ZM901.71,664.39c-3.85-.19-8.02-1.09-12.14-2.5-20.08-6.89-10.74-37.33,9.78-31.89,25.6,6.78,55.26,24.35,55.35,29.33.18,10.09-35.67,5.92-53,5.06ZM961.83,268.27c14.38-45.26,76.82-59.4,63.7,4.31-13.12,63.71,35.03,167.89,1.37,124.64-21.75-27.94-79.45-83.69-65.07-128.95ZM1065.41,547.94c-7.1,6.62-36.38-29.58-47.43-43.58-11.05-14-8.05-36.54,2.69-41.55,8.71-4.06,25.07,23.4,30.94,33.91,1.43,2.57,2.73,5.19,3.88,7.85,4.46,10.32,15.67,38,9.92,43.36Z"/>
                        <g class="cls-12">
                          <image width="4348" height="1636" transform="translate(-926.09 -100.04) scale(.69)" xlink:href="{values.url_imagen}"/>
                        </g>
                      </g>
                      <g>
                        <path class="cls-4_circulo" d="M27.25,565.47c-.38,2.05-1.75,2.9-3.77,2.72-1.78-.16-2.9-1.25-2.86-3.02.05-2.07,1.35-3.3,3.41-3.23,2.05.08,3.14,1.37,3.22,3.53Z"/>
                        <path class="cls-4_circulo" d="M98.17,504.01c.14,2.24-1.23,3.38-3.15,3.41-1.9.03-3.35-1.14-3.4-3.26-.04-1.84,1.19-2.84,2.87-3.01,2-.2,3.35.76,3.68,2.86Z"/>
                        <path class="cls-4_circulo" d="M94.96,629.15c-2.03-.26-3.52-1.14-3.34-3.25.16-1.87,1.41-3.34,3.35-3.22,1.78.11,3.23,1.21,3.19,3.34-.04,2.15-1.39,2.96-3.2,3.13Z"/>
                        <path class="cls-4_circulo" d="M98.2,534.56c-.23,2.43-1.53,3.22-3.57,3.04-1.72-.14-2.92-.99-2.98-2.79-.08-2.16,1.38-3.14,3.29-3.26,2.13-.13,3.01,1.31,3.27,3Z"/>
                        <path class="cls-4_circulo" d="M24.06,531.44c1.98.31,3.23,1.41,3.09,3.45-.14,2.13-1.62,2.89-3.61,2.76-1.83-.12-2.73-1.23-2.72-2.96,0-2.07,1.22-3.1,3.23-3.25Z"/>
                        <path class="cls-4_circulo" d="M59.3,629.15c-2.01-.2-3.33-1.33-3.19-3.29.13-1.86,1.48-3.24,3.43-3.17,1.94.07,3.07,1.36,3.04,3.41-.03,2.14-1.22,3.08-3.28,3.05Z"/>
                        <path class="cls-4_circulo" d="M24.02,629.14c-2.23.09-3.28-1.27-3.23-3.21.05-1.94,1.27-3.33,3.36-3.2,1.71.11,2.81,1.33,2.89,3.02.08,1.95-.78,3.36-3.02,3.39Z"/>
                        <path class="cls-4_circulo" d="M62.56,565.59c-.48,2.28-1.95,2.82-3.9,2.48-1.77-.31-2.7-1.48-2.46-3.2.27-1.99,1.65-3.08,3.66-2.86,2.1.23,2.83,1.69,2.7,3.57Z"/>
                        <path class="cls-4_circulo" d="M62.58,595.3c.04,2.22-1,3.36-3.17,3.36-1.75,0-3.07-.8-3.24-2.6-.19-2.04.99-3.48,2.94-3.76,2.1-.31,3.22,1,3.47,3Z"/>
                        <path class="cls-4_circulo" d="M98.13,596.26c-.21,1.57-1.54,2.47-3.57,2.33-1.77-.12-2.91-1.15-2.93-2.94-.03-2.13,1.5-3.42,3.32-3.38,1.74.04,3.38,1.11,3.18,3.99Z"/>
                        <path class="cls-4_circulo" d="M27.05,595.69c-.18,2.09-1.37,3.01-3.43,2.93-1.86-.08-2.71-1.24-2.81-2.9-.14-2.09,1.19-3.33,3.08-3.38,1.97-.05,3.03,1.34,3.16,3.35Z"/>
                        <path class="cls-4_circulo" d="M94.69,562.18c1.78-.11,3.14.62,3.38,2.4.28,2.05-.76,3.41-2.95,3.5-2.06.08-3.45-.85-3.45-3.05,0-1.9,1.35-2.6,3.02-2.85Z"/>
                        <path class="cls-4_circulo" d="M59.14,537.65c-1.84-.06-2.9-1.15-2.9-2.86,0-2.1,1.39-3.15,3.43-3.06,2.21.09,3.07,1.54,2.8,3.56-.24,1.84-1.56,2.49-3.33,2.36Z"/>
                        <path class="cls-4_circulo" d="M24,501.03c1.72.05,2.97,1.08,3,3.18.03,1.77-.95,2.93-2.77,3.04-2.12.13-3.35-1.02-3.36-3.13-.01-1.75.96-2.85,3.13-3.1Z"/>
                        <path class="cls-4_circulo" d="M59.42,501.18c1.76.1,2.94.88,3.09,2.75.17,2.19-1,3.32-3.1,3.37-1.77.04-3.03-1.06-3.19-2.72-.2-2.09,1.18-3.16,3.2-3.4Z"/>
                      </g>
                      <g>
                        <path class="cls-4_circulo" d="M798.91,209.13c-.14,1.67-.99,2.89-2.63,3.16-1.79.29-2.81-.91-3.02-2.54-.22-1.7.64-3.01,2.42-3.12,1.63-.11,2.84.77,3.23,2.51Z"/>
                        <path class="cls-4_circulo" d="M768.47,157.52c-.31,1.8-1.38,2.76-3.18,2.53-1.4-.17-2.55-1.01-2.52-2.56.03-1.77,1.16-2.94,2.88-2.97,1.81-.04,2.68,1.25,2.83,3Z"/>
                        <path class="cls-4_circulo" d="M735.35,206.65c2.03.4,2.8,1.64,2.64,3.35-.14,1.51-1.36,2.4-2.71,2.33-1.64-.08-2.99-1.21-2.87-2.96.11-1.67,1.35-2.65,2.94-2.72Z"/>
                        <path class="cls-4_circulo" d="M738.09,235.23c-.33,2.14-1.34,3.25-3.05,3.07-1.63-.18-2.8-1.35-2.61-3.08.18-1.62,1.31-2.76,3.05-2.65,1.78.11,2.39,1.49,2.62,2.66Z"/>
                        <path class="cls-4_circulo" d="M768.47,209.57c-.17,1.49-.95,2.75-2.72,2.79-1.7.03-2.84-1.08-2.97-2.74-.14-1.78,1.06-2.82,2.73-2.91,1.72-.1,2.77.91,2.96,2.86Z"/>
                        <path class="cls-4_circulo" d="M734.85,160.12c-1.35-.4-2.67-1.33-2.37-3.11.26-1.6,1.38-2.77,3.26-2.45,1.46.25,2.37,1.27,2.26,2.73-.13,1.66-.92,2.93-3.14,2.82Z"/>
                        <path class="cls-4_circulo" d="M796.14,154.45c1.95.23,2.73,1.46,2.67,3.11-.07,1.77-1.28,2.75-3,2.61-1.7-.13-2.78-1.21-2.58-3.02.18-1.7,1.29-2.59,2.91-2.7Z"/>
                        <path class="cls-4_circulo" d="M829.02,208.94c.06,1.95-.73,3.25-2.51,3.32-1.72.07-2.85-1.08-2.95-2.82-.08-1.5.97-2.55,2.31-2.73,1.63-.23,2.98.46,3.15,2.23Z"/>
                        <path class="cls-4_circulo" d="M859.51,209.13c0,1.78-.79,3.06-2.61,3.16-1.81.1-2.81-1.03-2.9-2.84-.08-1.58.94-2.57,2.3-2.76,1.67-.23,2.99.51,3.21,2.44Z"/>
                        <path class="cls-4_circulo" d="M738.05,261.71c-.4,1.7-1.26,2.83-3.15,2.57-1.83-.24-2.71-1.51-2.41-3.19.23-1.32,1.27-2.3,2.8-2.27,1.87.04,2.69,1.14,2.77,2.88Z"/>
                        <path class="cls-4_circulo" d="M765.09,264.3c-1.55-.29-2.55-1.47-2.23-3.19.31-1.7,1.61-2.55,3.45-2.23,1.58.28,2.24,1.44,2.14,2.83-.13,1.76-1.22,2.75-3.36,2.59Z"/>
                        <path class="cls-4_circulo" d="M735.72,180.64c1.76.24,2.46,1.57,2.26,3.22-.17,1.37-1.08,2.35-2.7,2.27-1.83-.1-2.93-1.09-2.8-2.87.13-1.71,1.24-2.71,3.23-2.61Z"/>
                        <path class="cls-4_circulo" d="M765.55,238.33c-1.55-.35-2.91-1.19-2.75-3.03.15-1.72,1.4-2.75,3.17-2.66,1.55.08,2.35,1.28,2.44,2.67.12,1.81-.92,2.86-2.86,3.02Z"/>
                        <path class="cls-4_circulo" d="M765.59,180.62c1.8.14,2.86,1.16,2.82,2.91-.03,1.38-.82,2.4-2.39,2.57-1.89.2-2.98-.8-3.15-2.48-.18-1.77.98-2.75,2.73-2.99Z"/>
                        <path class="cls-4_circulo" d="M829,157.63c-.19,1.84-1.24,2.74-3.04,2.41-1.35-.25-2.43-1.17-2.39-2.65.04-1.73,1.07-2.9,2.86-2.8,1.74.1,2.7,1.18,2.56,3.04Z"/>
                        <path class="cls-4_circulo" d="M796.02,232.65c1.97.12,2.66,1.35,2.65,3.01-.01,1.46-.82,2.45-2.35,2.45-1.66,0-2.98-.65-3-2.57-.02-1.8,1.09-2.66,2.71-2.9Z"/>
                        <path class="cls-4_circulo" d="M828.97,234.86c.03,2.6-1.09,3.35-2.85,3.2-1.4-.12-2.45-.9-2.49-2.4-.04-1.73.92-2.87,2.66-2.97,1.85-.1,2.63,1.08,2.68,2.17Z"/>
                        <path class="cls-4_circulo" d="M859.44,261.39c.04,1.52-.62,2.66-2.14,2.86-1.76.23-3.02-.61-3.22-2.49-.16-1.55.66-2.6,2.15-2.81,1.76-.25,3.01.48,3.2,2.44Z"/>
                        <path class="cls-4_circulo" d="M859.44,183.35c-.04,1.51-.68,2.58-2.28,2.69-1.8.12-2.98-.75-3.08-2.62-.08-1.54.82-2.51,2.31-2.67,1.83-.2,2.9.73,3.05,2.61Z"/>
                        <path class="cls-4_circulo" d="M826.23,258.93c1.59-.14,2.57.64,2.72,2.16.17,1.73-.52,3.03-2.47,3.15-1.54.1-2.58-.8-2.81-2.2-.31-1.83.79-2.83,2.57-3.11Z"/>
                        <path class="cls-4_circulo" d="M856.96,232.71c1.85.44,2.69,1.6,2.41,3.36-.25,1.55-1.46,2.12-2.89,1.98-1.47-.14-2.41-1.01-2.39-2.56.02-1.89,1.24-2.61,2.87-2.77Z"/>
                        <path class="cls-4_circulo" d="M795.9,258.92c1.61-.11,2.55.81,2.73,2.23.21,1.71-.52,2.98-2.48,3.12-1.62.11-2.54-.93-2.76-2.24-.3-1.75.66-2.89,2.52-3.11Z"/>
                        <path class="cls-4_circulo" d="M826.41,180.73c1.84.11,2.55,1.09,2.55,2.59,0,1.87-1.02,2.85-2.89,2.69-1.49-.13-2.45-1.04-2.43-2.55.03-1.85,1.22-2.66,2.78-2.73Z"/>
                        <path class="cls-4_circulo" d="M795.75,180.76c1.94-.06,2.75.89,2.85,2.36.11,1.77-.65,2.94-2.63,2.93-1.57-.01-2.51-.91-2.62-2.35-.14-1.79.88-2.82,2.4-2.95Z"/>
                        <path class="cls-4_circulo" d="M856.39,154.48c2.2.39,3.17,1.41,3.02,3.23-.14,1.61-1.29,2.23-2.72,2.18-1.41-.05-2.52-.63-2.61-2.31-.1-1.95,1.24-2.55,2.31-3.11Z"/>
                      </g>
                      <image width="1394" text-anchor="middle" dominant-baseline="middle" height="929" xlink:href="/img/anuncio11.png"/>
                      <g>
                        <rect class="cls-1" x="128.31" y="315.52" width="796.3" height="180" rx="13.59" ry="13.59"/>
                        <text class="cls-7" transform="translate(165.47 384.62)"><tspan text-anchor="middle" dominant-baseline="middle" x="355" y="0">{values.nombre.length >= 15 ? values.nombre.substring(0, 15) + "..." : values.nombre}</tspan></text>
                        <text class="cls-6" transform="translate(206.29 459.42)" text-anchor="middle" dominant-baseline="middle" ><tspan x="320" y="-15">Disponible {values.stock === 0 ? "pronto" : ""}</tspan></text>
                        <rect class="cls-10" x="387.42" y="477.47" width="278.08" height="70.11" rx="13.59" ry="13.59"/>
                        <text class="cls-5" transform="translate(456.7 558.76)" text-anchor="middle" dominant-baseline="middle"><tspan x="70" y="-45">$ {values.precio} /{values.unidad_producto}</tspan></text>
                      </g>
                      {#if values.is_promocion === true}
                      <g>
                        <g>
                          <path class="cls-8" d="M161.05,173.61c.19,5.37-1.6,8.61-5.16,10.79-3.88,2.37-7.85,2.27-11.72-.11-12.24-7.55-24.51-15.03-36.65-22.74-2.78-1.77-4.8-1.85-7.62-.05-11.51,7.37-23.23,14.4-34.78,21.71-4.72,2.99-9.36,4.22-14.28.76-4.27-3.01-5.44-7.35-3.87-13.75,3.3-13.41,6.5-26.84,9.97-40.2.8-3.08.08-4.87-2.33-6.85-10.66-8.79-21.11-17.84-31.72-26.68-4.18-3.49-6.67-7.55-4.91-13.04,1.66-5.19,5.56-7.39,10.96-7.98,14.03-1.54,28.12-2.35,42.2-3.01,3.19-.15,4.72-1.26,5.88-4.2,5.29-13.36,10.71-26.67,16.28-39.92,3.37-8.02,12.81-9.83,18.51-3.77,1.4,1.49,2.15,3.33,2.9,5.18,5.29,12.9,10.62,25.79,15.84,38.73.91,2.26,1.77,3.74,4.69,3.92,14.5.91,28.99,2.11,43.48,3.2,5.45.41,9.2,3.09,10.72,7.68,1.49,4.51.05,8.96-4.19,12.55-10.32,8.75-20.53,17.65-31.09,26.1-3.67,2.93-4.5,5.51-3.24,10.06,3.46,12.48,6.3,25.13,9.36,37.71.4,1.65.65,3.34.76,3.9Z"/>
                          <path class="cls-11" d="M51.52,174.11c1.39-5.77,2.92-12.13,4.46-18.49,2.22-9.13,4.29-18.3,6.76-27.36.85-3.12.2-4.96-2.22-6.97-11.4-9.46-22.68-19.08-33.98-28.68-1.07-.91-2.2-1.89-2.9-3.08-2.35-3.94.21-8.24,5.23-8.63,15.06-1.19,30.12-2.37,45.2-3.33,3.6-.23,5.48-1.5,6.84-4.98,5.34-13.65,11.08-27.15,16.58-40.74,1.2-2.97,2.67-5.47,6.27-5.44,3.38.03,4.83,2.37,5.98,5.21,5.55,13.72,11.32,27.36,16.74,41.14,1.3,3.3,3.12,4.55,6.56,4.78,14.93.96,29.85,2.2,44.78,3.23,2.96.2,5.38,1.02,6.43,3.97,1.12,3.17-.47,5.43-2.83,7.42-11.56,9.72-23.04,19.54-34.66,29.19-2.28,1.89-2.98,3.67-2.24,6.6,3.59,14.07,6.97,28.2,10.42,42.3.17.69.37,1.38.54,2.07.66,2.79.66,5.4-1.99,7.29-2.62,1.87-5.08,1.16-7.55-.38-12.82-7.96-25.72-15.8-38.45-23.92-2.87-1.83-4.94-1.68-7.71.07-12.75,8.07-25.64,15.93-38.46,23.89-2.2,1.36-4.45,2.06-6.84.73-2.01-1.12-3.09-2.9-2.98-5.91Z"/>
                        </g>
                        <text class="cls-2_oferta" transform="translate(67.21 122.71)" text-anchor="middle" dominant-baseline="middle"><tspan x="36" y="-10">{parseInt(values.descuento, 10)}%</tspan></text>
                        <text class="cls-3" transform="translate(86.54 134.74)"><tspan x="0" y="0">de dcto</tspan></text>
                      </g>
                      {/if}
                    </g>
                  </svg>
                </a>
                
              </li>
              {/if}
          {/each}
        </ul>
      </div>
    
    </div>
    
    
  </div>
</div>

<style>
svg{
  width: 100%;
  margin: auto
  ;
}

  .modal {
    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.652);
  }

  .modal.open {
    display: block;
  }

  .modal-content {
    background-color: transparent;
    padding:10px;
    width: 65%;
    margin: auto;
    margin-top: 30px;
    border: none;
  }

  .close {
    border: 3px solid white;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.068);
    color: #ffffff;
    font-size: 28px;
    font-weight: bold;
    width: 50px;
    top: -10px;
    right: -10px;
    z-index: 9999;
  }

  .close:hover,
  .close:focus {
    text-decoration: none;
    cursor: pointer;
  }

  @media (max-width: 1100px) {
    .modal-content {
      width: 70%;
      margin-top: 30px;
    }
  }

  @media (max-width: 770px) {
    .modal-content {
      width: 80%;
      margin-top: 30px;
    }
  }

  @media (max-width: 570px) {
    .modal-content {
      width: 90%;
      margin-top: 20%;
    }
  }

  @media (max-width: 400px) {
    .modal-content {
      width: 100%;
      margin-top: 40%;
    }

    .close {
    
    top: -60px;
    right: 10px;
  }
  }
  
</style>
