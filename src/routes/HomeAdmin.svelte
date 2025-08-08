<script>
    import { eliminarProducto } from '../api/productos';
    import HeaderAdmin from '../components/HeaderAdmin.svelte';
    import Chart from "../components/graficos/ProdMasVendidos.svelte";
    import Ganancias from '../components/graficos/Ganancias.svelte';
    import VentasPorFechas from '../components/graficos/VentasPorFechas.svelte';
    import VentasPorProducto from '../components/graficos/VentasPorProducto.svelte';
    import Stock from '../components/graficos/Stock.svelte';
    import MenuLateral from '../components/MenuLateral.svelte';
    import { getPedidosIndex, getProductosIndex, getCategoriasIndex, getUsuariosIndex } from '../api/admin.js'; // Importa la función de la API
    import { onMount } from 'svelte';


    let totalPedidos = 0
    let totalProductos = 0
    let totalCategorias = 0
    let totalUsuarios = 0

    onMount(async () => {
        totalPedidos = await getPedidosIndex(); // Llama a la función externa
        totalProductos = await getProductosIndex(); // Llama a la función externa
        totalCategorias = await getCategoriasIndex(); // Llama a la función externa
        totalUsuarios = await getUsuariosIndex(); // Llama a la función externa
    });
    


</script>

<main>

    <div class="row m-0" style="padding-left: 4.5rem;">
        <MenuLateral/>
        <div class="col">
            <div class="row">
                <h4 class="col-6 text-dark pt-2">Administración</h4>
          
            </div>

            <div class="row">

                <div class="col-12 col-md-6">
                    <div class="row mb-3">

                        <div class="col-6 col-xl-3 col-sm-6 mb-xl-0 mb-2">
                            <div class="card p-2">
                                <p class="text-sm mb-0 text-uppercase font-weight-bold">Productos</p>

                                <div class="row">
                                    <div class="col-6">
                                        <p class="mb-0">Total</p>
                                        <h5 class="font-weight-bolder">{totalProductos}</h5>
                                    </div>
                                    <div class="col-4 text-end">
                                        <div class="icon icon-shape bg-success shadow-success text-center rounded-circle">
                                            <span class="material-symbols-outlined simbolo-icon mt-2 pt-1">inventory</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 col-xl-3 col-sm-6 mb-xl-0 mb-2">
                            <div class="card p-2">
                                <p class="text-sm mb-0 text-uppercase font-weight-bold">Categorías</p>

                                <div class="row">
                                    <div class="col-6">
                                        <p class="mb-0">Total</p>
                                        <h5 class="font-weight-bolder">{totalCategorias}</h5>
                                    </div>
                                    <div class="col-4 text-end">
                                        <div class="icon icon-shape bg-success shadow-success text-center rounded-circle">
                                            <span class="material-symbols-outlined simbolo-icon mt-2 pt-1">category</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 col-xl-3 col-sm-6 mb-xl-0 mb-2">
                            <div class="card p-2">
                                <p class="text-sm mb-0 text-uppercase font-weight-bold">Pedidos</p>

                                <div class="row">
                                    <div class="col-6">
                                        <p class="mb-0">Total</p>
                                        <h5 class="font-weight-bolder">{totalPedidos}</h5>
                                    </div>
                                    <div class="col-4 text-end">
                                        <div class="icon icon-shape bg-success shadow-success text-center rounded-circle">
                                            <span class="material-symbols-outlined simbolo-icon mt-2 pt-1">contract</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 col-xl-3 col-sm-6 mb-xl-0 mb-2">
                            <div class="card p-2">
                                <p class="text-sm mb-0 text-uppercase font-weight-bold">Usuarios</p>

                                <div class="row">
                                    <div class="col-6">
                                        <p class="mb-0">Total</p>
                                        <h5 class="font-weight-bolder">{totalUsuarios}</h5>
                                    </div>
                                    <div class="col-4 text-end">
                                        <div class="icon icon-shape bg-success shadow-success text-center rounded-circle">
                                            <span class="material-symbols-outlined simbolo-icon mt-2 pt-1">group</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                    </div>
                    <HeaderAdmin/>

                </div>

                <div class="col-12 col-md-6">
                    <div class="card" >
                        <Chart/>
                    </div>
                </div>

                <div class="col-12 col-md-5 mt-4">
                    <div class="card p-2">
                        <VentasPorFechas/>
                    </div>
                </div>

                <div class="col-12 col-md-7 mt-4">
                    <div class="card p-2" >
                        <VentasPorProducto/>
                    </div>
                </div>
            
        </div>
    </div>
    
</main>
