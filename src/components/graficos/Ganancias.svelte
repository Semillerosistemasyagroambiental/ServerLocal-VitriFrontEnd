<script>
    import { onMount } from "svelte";
    import {
      Chart,
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend
    } from "chart.js";
  
    // Registrar componentes necesarios
    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend
    );
  
    let labels = []; // Fechas
    let data = []; // Ganancias
    let periodo = "mensual"; // Periodo seleccionado
    let errorMessage = ""; // Mensaje de error
    let canvas; // Referencia al elemento <canvas>
  
    async function cargarDatos() {
      try {
        // Llamada a la API con el filtro de periodo
        const response = await fetch(`http://127.0.0.1:5000/api/admin/stats/ganancias-por-fechas?periodo=${periodo}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos de ganancias por fechas");
        }
  
        const json = await response.json();
  
        // Procesar los datos para Chart.js
        labels = json.map((entry) => entry.fecha); // Fechas
        data = json.map((entry) => parseFloat(entry.ganancia)); // Ganancias
  
        // Crear el gráfico
        const ctx = canvas.getContext("2d");
        new Chart(ctx, {
          type: "line", // Tipo de gráfico: línea
          data: {
            labels: labels,
            datasets: [
              {
                label: "Ganancias",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                tension: 0.4, // Suaviza las líneas
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
              title: {
                display: true,
                text: `Ganancias (${periodo})`,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } catch (error) {
        errorMessage = error.message;
        console.error(error);
      }
    }
  
    // Cargar datos al montar el componente
    onMount(cargarDatos);
  
    // Recargar datos cuando cambie el periodo
    $: if (periodo) {
      cargarDatos();
    }
  </script>
  
  <!-- Contenedor para el gráfico -->
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {:else}
    <div>
      <label for="periodo">Selecciona un periodo:</label>
      <select id="periodo" bind:value={periodo}>
        <option value="diario">Diario</option>
        <option value="semanal">Semanal</option>
        <option value="mensual">Mensual</option>
        <option value="anual">Anual</option>
      </select>
      <canvas bind:this={canvas}></canvas>
    </div>
  {/if}
  
  <style>
    .error {
      color: red;
      font-weight: bold;
    }
    label {
      display: block;
      margin-bottom: 8px;
    }
    select {
      margin-bottom: 16px;
    }
  </style>
  