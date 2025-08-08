<script>
    import { onMount } from "svelte";
    import {
      Chart,
      BarController,
      BarElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend
    } from "chart.js";
    import ChartDataLabels from "chartjs-plugin-datalabels";
  
    // Registrar componentes necesarios
    Chart.register(
      BarController,
      BarElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend,
      ChartDataLabels
    );
  
    let labels = []; // Fechas
    let data = []; // Montos vendidos
    let limite = 6; // Número de resultados
    let fechaInicio = ""; // Fecha de inicio
    let fechaFin = ""; // Fecha de fin
    let errorMessage = ""; // Mensaje de error
    let canvas; // Referencia al elemento <canvas>
    let chartInstance = null; // Referencia al gráfico actual
  
    // Colores para las barras
    const colors = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
      "#E7E9ED", "#6D9EEB", "#93C47D", "#F6B26B"
    ];
  
    async function cargarDatos() {
      try {
        // Construir la URL con parámetros
        let url = `http://127.0.0.1:5000/api/admin/stats/ventas-productos-por-fecha?limite=${limite}`;
        if (fechaInicio) url += `&fecha_inicio=${fechaInicio}`;
        if (fechaFin) url += `&fecha_fin=${fechaFin}`;
  
        // Llamada a la API
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
  
        const json = await response.json();
  
        // Procesar los datos
        labels = json.map((entry) => `${entry.fecha} - ${entry.producto}`);
        data = json.map((entry) => entry.monto_vendido);
  
        // Destruir gráfico existente si hay uno
        if (chartInstance) {
          chartInstance.destroy();
        }
  
        // Crear el gráfico
        const ctx = canvas.getContext("2d");
        chartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Monto Vendido",
                data: data,
                backgroundColor: colors, // Usa colores vibrantes
                borderColor: colors.map((c) => c.replace("0.2", "1")), // Bordes con el mismo color
                borderWidth: 2,
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
                text: `Ventas por Producto (${fechaInicio || "Inicio"} - ${fechaFin || "Fin"})`,
                font: {
                  size: 18,
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `$${context.raw.toFixed(2)}`;
                  },
                },
              },
              datalabels: {
                anchor: "end",
                align: "top",
                color: "black",
                font: {
                  weight: "bold",
                  size: 12,
                },
                formatter: function (value) {
                  return `$${value.toFixed(2)}`;
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  font: {
                    size: 12,
                  },
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return `$${value}`;
                  },
                  font: {
                    size: 12,
                  },
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
      } catch (error) {
        errorMessage = error.message;
        console.error(error);
      }
    }
  
    // Cargar datos al montar el componente
    onMount(cargarDatos);
  
    // Recargar datos cuando cambie algún filtro
    $: if (limite || fechaInicio || fechaFin) {
      cargarDatos();
    }
  </script>
  
  <!-- Contenedor para los filtros y el gráfico -->
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {:else}
    <div class="row  mb-n3">
      <div class="col-12 col-md-4">
        <div class="input-group input-group-static my-2">
          <label for="limite">Número de productos</label>
          <input type="number" class="form-control p-2" id="limite" bind:value={limite} min="1" />
        </div>
      </div>
      
      <div class="col-12 col-md-4">
        <label for="fechaInicio" class="form-label">Fecha de inicio</label>
        <input type="date" class="form-control border p-2" id="fechaInicio" bind:value={fechaInicio} />
      </div>

  
      <div class="col-12 col-md-4">
        <label for="fechaFin" class="form-label">Fecha de fin</label>
        <input type="date" class="form-control border p-2" id="fechaFin" bind:value={fechaFin} />
      </div>
      
  
    </div>
    <canvas bind:this={canvas}></canvas>

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
    input {
      margin-bottom: 16px;
    }
  </style>
  