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
      Legend,
      Filler,
  } from "chart.js";
  import ChartDataLabels from 'chartjs-plugin-datalabels'; // Plugin para etiquetas

  // Registrar componentes y plugins de Chart.js
  Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend,
      Filler,
      ChartDataLabels
  );

  let labels = []; // Meses
  let data = []; // Ventas totales
  let canvas; // Referencia al canvas
  let chartInstance = null; // Instancia del gráfico

  async function cargarVentasUltimos6Meses() {
      try {
          const response = await fetch("http://127.0.0.1:5000/api/admin/stats/ventas-ultimos-6-meses");
          if (!response.ok) {
              throw new Error("Error al cargar los datos.");
          }

          const json = await response.json();

          // Procesar datos
          labels = json.map((entry) => entry.mes);
          data = json.map((entry) => parseFloat(entry.total_ventas));

          // Destruir gráfico existente si ya existe
          if (chartInstance) {
              chartInstance.destroy();
          }

          // Crear gráfico
          const ctx = canvas.getContext("2d");
          chartInstance = new Chart(ctx, {
              type: "line",
              data: {
                  labels: labels,
                  datasets: [
                      {
                          label: "Ventas Totales",
                          data: data,
                          backgroundColor: "rgba(54, 162, 235, 0.2)", // Área sombreada
                          borderColor: "rgba(54, 162, 235, 1)", // Línea
                          pointBackgroundColor: "rgba(54, 162, 235, 1)",
                          pointRadius: 5, // Tamaño de los puntos
                          borderWidth: 2,
                          tension: 0.4, // Líneas suavizadas
                          fill: true, // Rellenar debajo de la línea
                      },
                  ],
              },
              options: {
                  responsive: true,
                  plugins: {
                      legend: {
                          display: true,
                          position: "top",
                      },
                      title: {
                          display: true,
                          text: "Ventas de los Últimos Meses",
                          font: {
                              size: 16,
                          },
                      },
                      tooltip: {
                          enabled: false, // Deshabilitar tooltips estándar
                      },
                      datalabels: {
                          anchor: 'end', // Posición de las etiquetas
                          align: 'top', // Alineación hacia arriba
                          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco
                          borderRadius: 4, // Bordes redondeados
                          borderWidth: 1, // Ancho del borde
                          borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
                          color: '#000', // Color del texto
                          font: {
                              size: 12,
                          },
                          formatter: (value) => `${value.toLocaleString('en-US')}`, // Formato con separadores de miles
                      },
                  },
                  scales: {
                      y: {
                          beginAtZero: true,
                          title: {
                              display: true,
                              text: "Ventas Totales",
                          },
                      },
                      x: {
                          title: {
                              display: true,
                              text: "Meses",
                          },
                          ticks: {
                              maxRotation: 45,
                              minRotation: 0,
                          },
                      },
                  },
              },
              plugins: [ChartDataLabels], // Activar plugin de etiquetas
          });
      } catch (error) {
          console.error("Error:", error);
      }
  }

  // Cargar datos al montar el componente
  onMount(cargarVentasUltimos6Meses);
</script>

<div>
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  canvas {
      max-width: 100%;
      height: 400px;
      margin: 20px auto;
  }
</style>
