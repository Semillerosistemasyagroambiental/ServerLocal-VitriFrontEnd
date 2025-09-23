<script>
    import { onMount } from 'svelte';
    import { getProductos, eliminarProducto } from '../api/productos';
    import MenuAcciones from '../components/MenuLateral.svelte';
    import ExportInventario from '../components/ExportInventario.svelte';

    let productos = [];
    let errorMessage = '';
    let searchTerm = '';

    // --- Ordenamiento ---
    // Opciones: created_at, updated_at, stock_desc, stock_asc
    let sortOption = 'created_at';

    // --- Paginación ---
    let page = 1;
    let pageSize = 24; // puedes cambiar el default

    onMount(async () => {
        try {
            productos = await getProductos();
        } catch (error) {
            errorMessage = 'No se pudieron cargar los productos.';
        }
    });

    // Helpers para obtener fechas robustamente (nombres de campo flexibles)
    function getCreatedAt(p) {
        return p.created_at || p.fecha_creacion || p.created || p.createdAt || p.fechaCreacion || null;
    }
    function getUpdatedAt(p) {
        return p.updated_at || p.fecha_actualizacion || p.updated || p.updatedAt || p.fechaActualizacion || null;
    }

    // --- Filtro por texto ---
    $: filteredProductos = productos.filter((producto) => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return true;

        const nombre = (producto.nombre ?? '').toLowerCase();
        const idStr = (producto.id ?? '').toString();
        const precioStr = (producto.precio ?? '').toString();
        const stockStr = (producto.stock ?? '').toString();

        return (
            nombre.includes(term) ||
            idStr.includes(term) ||
            precioStr.includes(term) ||
            stockStr.includes(term)
        );
    });

    // --- Ordenamiento según select ---
    function safeDateVal(val) {
        const t = Date.parse(val);
        return isNaN(t) ? 0 : t;
    }

    $: sortedProductos = [...filteredProductos].sort((a, b) => {
        switch (sortOption) {
            case 'updated_at': {
                const aa = safeDateVal(getUpdatedAt(a));
                const bb = safeDateVal(getUpdatedAt(b));
                // más reciente primero
                return bb - aa;
            }
            case 'stock_desc': {
                const aa = Number(a.stock ?? 0);
                const bb = Number(b.stock ?? 0);
                return bb - aa; // mayor stock primero
            }
            case 'stock_asc': {
                const aa = Number(a.stock ?? 0);
                const bb = Number(b.stock ?? 0);
                return aa - bb; // menor stock primero
            }
            case 'created_at':
            default: {
                const aa = safeDateVal(getCreatedAt(a));
                const bb = safeDateVal(getCreatedAt(b));
                // más reciente primero
                return bb - aa;
            }
        }
    });

    // --- Paginación derivada ---
    $: totalItems = sortedProductos.length;
    $: totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    // reajusta página si el filtro/orden cambian y dejan la página fuera de rango
    $: if (page > totalPages) page = totalPages;
    $: if (page < 1) page = 1;

    $: startIdx = (page - 1) * pageSize;
    $: endIdx = startIdx + pageSize;
    $: paginatedProductos = sortedProductos.slice(startIdx, endIdx);

    function goToPage(p) {
        if (p >= 1 && p <= totalPages) page = p;
    }

    // --- Eliminar ---
    async function handleEliminar(id) {
        try {
            await eliminarProducto(id);
            productos = productos.filter((p) => p.id !== id);
            // ajustar paginación si la página queda vacía
            if ((page - 1) * pageSize >= (sortedProductos.length || 1)) {
                page = Math.max(1, page - 1);
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    }
</script>

<main>
    <div class="row m-0" style="padding-left: 4.5rem;">
        <MenuAcciones/>
        <div class="col">
            <div class="row">
                <h4 class="col-6 text-dark pt-3">Productos</h4>
                <div class="col-6 mt-3 text-end">
                    <a href="/producto/nuevo" class="btn btn-sm btn-success">Agregar producto</a>
                </div>
            </div>
            
            <!-- Controles: Buscador + Orden + Tamaño de página -->
            <div class="card p-2 mb-1">
                <div class="row g-2 align-items-center">
                    <div class="col-12 text-end justify-content-end d-flex">
                        <ExportInventario
                        data={productos}
                        filtered={sortedProductos}
                        paginated={paginatedProductos}
                        filenamePrefix="inventario_productos"
                        
                        columns={[
                        { key: 'id', label: 'ID' },
                        { key: 'nombre', label: 'Nombre' },
                        { key: 'precio', label: 'Precio' },
                        { key: 'stock', label: 'Stock' },
                        { key: 'is_activo', label: 'Activo', transform: v => v ? 'Sí' : 'No' },
                        { key: 'is_promocion', label: 'En promoción', transform: v => v ? 'Sí' : 'No' },
                        // { key: 'descuento', label: 'Descuento' },
                        { key: '__created', label: 'Fecha creación' },
                        { key: '__updated', label: 'Fecha edición' },
                        // { key: 'url_imagen', label: 'URL Imagen' },
                        ]}
                        createdKeys={['created_at','fecha_creacion']}
                        updatedKeys={['updated_at','fecha_actualizacion']}
                        
                    />
                    </div>
                    <div class="col-md-6 col-lg-4">
                        <input 
                            type="text" 
                            class="form-control border p-2" 
                            placeholder="Buscar productos por nombre, ID, precio o stock..." 
                            bind:value={searchTerm}
                            on:input={() => (page = 1)}
                        />
                    </div>

                    <div class="col-6 col-md-4 col-lg-2">
                        <div class="d-flex gap-2">
                            <select class="form-select border p-2 text-muted" bind:value={sortOption} on:change={() => (page = 1)}>
                                <option value="created_at">Fecha de creación</option>
                                <option value="updated_at">Fecha de edición</option>
                                <option value="stock_desc">Mayor stock</option>
                                <option value="stock_asc">Menor stock</option>
                            </select>
                        </div>
                    </div>

                    <!-- <div class="col-6 col-lg-2">
                        <select class="form-select" bind:value={pageSize} on:change={() => (page = 1)}>
                            <option value="12">12 por página</option>
                            <option value="24">24 por página</option>
                            <option value="36">36 por página</option>
                            <option value="48">48 por página</option>
                        </select>
                    </div> -->

                    <div class="col text-end">
                        <small class="text-muted">
                            Mostrando {paginatedProductos.length} de {sortedProductos.length} (total {productos.length})
                        </small>
                    </div>
                </div>
            </div>

            <!-- Grid de productos -->
            <div class="p-2">
                {#if errorMessage}
                    <div class="alert alert-danger">{errorMessage}</div>
                {/if}
                
                {#if sortedProductos.length === 0 && !errorMessage}
                    <div class="text-center p-5">
                        <p class="text-muted">No hay productos disponibles que coincidan con tu búsqueda.</p>
                    </div>
                {/if}

                <div class="row">
                    {#each paginatedProductos as producto}
                    <div class="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2 col-xxl-2 mb-2 px-1 d-flex">
                        <div class="card bg-gray w-100 d-flex flex-column" style="height: 100%;">
                            <!-- Badge de ID / estado -->
                            {#if producto.id}
                                <span
                                    class={producto.is_activo === true ? "bg-success opacity-9 pb-1 col-4 text-white text-center position-absolute" : "bg-danger opacity-9 pb-1 col-4 text-white text-center position-absolute"}
                                    style="z-index: 3; border-radius: 10px 0px 20px;">
                                    <small class="text-white">ID: {producto.id}</small>
                                </span>
                            {/if}
                            
                            <!-- Botones superiores -->
                            <div class="position-absolute end-1 top-1" style="z-index: 3;">
                                <a href="/entrada/{producto.id}" 
                                class="bg-info border-white border border-2 cursor-pointer text-white text-center me-n1"
                                style="border-radius: 20px; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; text-decoration: none;">
                                    +
                                </a>
                                
                                {#if (producto.stock ?? 0) > 0}
                                    <a href="/salida/{producto.id}" 
                                    class="bg-warning border-white border border-2 cursor-pointer text-white text-center"
                                    style="border-radius: 20px; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; text-decoration: none;">
                                        -
                                    </a>
                                {:else}
                                    <div class="bg-secondary border-white border border-2 text-white text-center"
                                        style="border-radius: 20px; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; opacity: 0.5;">
                                        <i class="fas fa-arrow-up"></i>
                                    </div>
                                {/if}
                            </div>

                            <div class="card-header p-0 position-relative z-index-2 flex-grow-0"
                                style="border-radius: 0.75rem 0.75rem 0px 0px;">
                                <div class="d-block blur-shadow-image">
                                    <div class="img-container"
                                        style="height: 170px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                                        <img alt="producto" class="img-fluid w-100 h-100 object-fit-cover"
                                            src="{producto.url_imagen}"
                                            style="border-radius: 0.75rem 0.75rem 0px 0px; object-fit: cover;">
                                    </div>
                                </div>
                                <div class="blur col-8 col-sm-6 text-dark text-center position-absolute"
                                    style="z-index: 3; border-radius: 7px 0px 0px; bottom: 1px; right: 1px; height: 20px; font-size: 15px;">
                                    Stock: {producto.stock ?? 0}
                                </div>
                            </div>
                            
                            <div class="card-body p-2 d-flex flex-column flex-grow-1">
                                <h6 class="text-dark text-center nombre mb-1"
                                    style="min-height: 35px; display: flex; align-items: center; justify-content: center; line-height: 1.0;">
                                    {producto.nombre}
                                </h6>
                                
                                <!-- Precio -->
                                <div class="text-dark text-center border-bottom pb-1 border-gray mb-2">
                                    <span class="text-success font-weight-bold">$ {producto.precio}</span>
                                    {#if producto.is_promocion}
                                        <br>
                                        <small class="text-warning">
                                            Con descuento: $ {( (producto.precio ?? 0) - (producto.precio ?? 0) * (producto.descuento ?? 0) / 100 ).toFixed(2)}
                                        </small>
                                    {/if}
                                </div>
                                
                                <!-- Botones de acción -->
                                <div class="mt-auto text-center">
                                    <a class="btn mb-0 bg-info text-sm text-white btn-sm me-1" 
                                       href="/producto/{producto.id}">
                                        editar
                                    </a>
                                    <button class="btn mb-0 btn-danger text-sm btn-sm" 
                                            on:click={() => handleEliminar(producto.id)}>
                                        x
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/each}
                </div>

                <!-- Paginación -->
                {#if totalPages > 1}
                <nav class="mt-3">
                    <ul class="pagination justify-content-center flex-wrap">
                        <li class={"page-item " + (page === 1 ? 'disabled' : '')}>
                            <button class="page-link" on:click={() => goToPage(page - 1)}>◁</button>
                        </li>

                        {#each Array(totalPages) as _, idx}
                            {#if Math.abs(idx + 1 - page) <= 2 || idx === 0 || idx + 1 === totalPages}
                                <li class={"page-item " + (page === idx + 1 ? 'active text-white' : '')}>
                                    <button class="page-link" on:click={() => goToPage(idx + 1)}>
                                        {idx + 1}
                                    </button>
                                </li>
                            {:else if (idx + 1 === page - 3) || (idx + 1 === page + 3)}
                                <li class="page-item disabled"><span class="page-link">…</span></li>
                            {/if}
                        {/each}

                        <li class={"page-item " + (page === totalPages ? 'disabled' : '')}>
                            <button class="page-link" on:click={() => goToPage(page + 1)}>▷</button>
                        </li>
                    </ul>
                </nav>
                {/if}
            </div>
        </div>
    </div>
</main>
