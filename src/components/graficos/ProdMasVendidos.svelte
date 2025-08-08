<script>
  import { onMount } from "svelte";
  import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
  } from "chart.js";

  // Registrar componentes necesarios
  Chart.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title
  );

  let labels = []; // Etiquetas del gráfico
  let data = []; // Datos del gráfico
  let periodo = "mensual"; // Periodo seleccionado por el usuario
  let errorMessage = ""; // Mensaje de error
  let canvas; // Referencia al elemento <canvas>
  let chartInstance = null; // Referencia a la instancia del gráfico

  // Colores dinámicos para cada barra
  const coloresBarras = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#E7E9ED", "#6D9EEB",
    "#93C47D", "#F6B26B", "#FF5733", "#C70039", "#900C3F", "#581845", "#DAF7A6"
  ];

  async function cargarDatos() {
    try {
      // Llamada a la API con el filtro de periodo
      const response = await fetch(`http://127.0.0.1:5000/api/admin/stats/productos-mas-vendidos?periodo=${periodo}`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }

      const json = await response.json();

      // Procesar los datos para Chart.js
      labels = json.map((producto) => producto.producto); // Nombres de los productos
      data = json.map((producto) => parseFloat(producto.total_vendido)); // Cantidades vendidas

      // Destruir el gráfico existente si ya hay uno
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Crear el gráfico
      const ctx = canvas.getContext("2d");
      chartInstance = new Chart(ctx, {
        type: "bar", // Tipo de gráfico: barra
        data: {
          labels: labels,
          datasets: [
            {
              label: `Productos más vendidos (${periodo})`,
              data: data,
              backgroundColor: coloresBarras.slice(0, labels.length), // Aplica los colores a cada barra
              borderColor: coloresBarras.slice(0, labels.length).map(c => c.replace("0.6", "1")), // Bordes más visibles
              borderWidth: 1,
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
              text: `Productos más vendidos (${periodo})`,
              font: {
                size: 20,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 14,
                },
                callback: function (value) {
                  return value;
                },
              },
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
  <div class="p-3">
    <div class="row">
      <div class="col-12 col-md-4 my-auto">
        <label for="periodo" class="form-label">Selecciona un periodo</label>
      </div>
      <div class="col my-auto">
        <div class="input-group input-group-outline">
          <select id="periodo" bind:value={periodo} class="form-select border px-3">
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
        </div>
      </div>
    </div>
    
    <canvas bind:this={canvas}></canvas>
  </div>
{/if}

<style>
  .error {
    color: red;
    font-weight: bold;
  }
  label {
    font-size: 16px;
    font-weight: 600;
  }
  select {
    font-size: 14px;
  }
</style>
