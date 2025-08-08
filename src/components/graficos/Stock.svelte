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
  let data = []; // Datos del gráfico (stock)
  let colores = []; // Colores dinámicos para las barras
  let errorMessage = ""; // Mensaje de error
  let canvas; // Referencia al elemento <canvas>
  let chartInstance = null; // Referencia a la instancia del gráfico

  async function cargarDatos() {
    try {
      // Llamada a la API para obtener los datos de stock
      const response = await fetch("http://127.0.0.1:5000/api/admin/stats/productos-stock");
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }

      const json = await response.json();

      // Procesar los datos para Chart.js
      labels = json.map((producto) => producto.producto); // Nombres de los productos
      data = json.map((producto) => parseInt(producto.stock)); // Cantidad de stock

      // Asignar colores según el nivel de stock
      colores = data.map(stock => {
        if (stock === 0) {
          return "rgba(255, 99, 132, 0.6)"; // Rojo si está agotado
        } else if (stock < 5) {
          return "rgba(255, 159, 64, 0.6)"; // Naranja si está bajo
        } else {
          return "rgba(75, 192, 192, 0.6)"; // Verde si tiene suficiente stock
        }
      });

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
              label: "Stock de productos",
              data: data,
              backgroundColor: colores, // Colores dinámicos según el stock
              borderColor: colores.map(c => c.replace("0.6", "1")), // Bordes más visibles
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              labels: {
                boxWidth: 20,
                padding: 10,
              },
            },
            title: {
              display: true,
              text: "Nivel de stock de productos",
              font: {
                size: 20,
              },
              padding: {
                top: 10,
                bottom: 30,
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
                  return value + " unidades";
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

</script>

<!-- Contenedor para el gráfico -->
{#if errorMessage}
  <div class="alert alert-danger" role="alert">
    {errorMessage}
  </div>
{:else}
  <div class="container">
 
    <div class="row justify-content-center">
      <div class="col-md-8 col-12">
        <canvas bind:this={canvas}></canvas>
      </div>
    </div>
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
  .container {
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  h3 {
    font-weight: 700;
    color: #333;
  }
  p {
    font-size: 14px;
    color: #666;
  }
  .alert {
    font-size: 16px;
    font-weight: 600;
  }
</style>
