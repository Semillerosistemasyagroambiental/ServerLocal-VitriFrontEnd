<script>
    import { onMount } from "svelte";
    import {
      Chart,
      DoughnutController,
      ArcElement,
      Tooltip,
      Legend,
      Title,
    } from "chart.js";
  
    // Registrar componentes necesarios
    Chart.register(DoughnutController, ArcElement, Tooltip, Legend, Title);
  
    let labels = []; // Etiquetas para el gráfico (productos)
    let data = []; // Datos para el gráfico (ingresos por producto)
    let errorMessage = ""; // Mensaje de error
    let canvas; // Referencia al elemento <canvas>
  
    onMount(async () => {
      try {
        // Llamada a la API para obtener los ingresos por producto
        const response = await fetch("http://127.0.0.1:5000/api/admin/stats/ingresos-por-producto");
        if (!response.ok) {
          throw new Error("Error al obtener los datos de ingresos por producto");
        }
  
        const json = await response.json();
  
        // Procesar los datos para Chart.js
        labels = json.map((producto) => producto.producto); // Nombres de los productos
        data = json.map((producto) => parseFloat(producto.total_ingresos)); // Ingresos generados
  
        // Crear el gráfico
        const ctx = canvas.getContext("2d");
        new Chart(ctx, {
          type: "doughnut", // Tipo de gráfico: rosquilla
          data: {
            labels: labels,
            datasets: [
              {
                label: "Ingresos por Producto",
                data: data,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                ],
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
                text: "Ingresos por Producto",
              },
            },
          },
        });
      } catch (error) {
        errorMessage = error.message;
        console.error(error);
      }
    });
  </script>
  
  <!-- Contenedor para el gráfico -->
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {:else}
    <div>
      <canvas bind:this={canvas}></canvas>
    </div>
  {/if}
  
  <style>
    .error {
      color: red;
      font-weight: bold;
    }
  </style>
  