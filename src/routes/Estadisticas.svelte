<script>
    import Chart from "../components/graficos/ProdMasVendidos.svelte";
    import IngresosPorProducto from "../components/graficos/IngresosPorProducto.svelte";

  </script>
  
  <h1>Estadísticas</h1>
  
  <!-- Muestra el gráfico de productos más vendidos -->
  <div>
    <h2>Productos Más Vendidos</h2>
    <Chart/>

    <h2>Ingresos Por Productos</h2>
    <IngresosPorProducto/>

  </div>
  