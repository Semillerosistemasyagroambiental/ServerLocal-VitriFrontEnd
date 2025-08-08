// Importamos las funciones necesarias para interactuar con la API y la tienda de Svelte
import { getProductosAPedir } from './productos';
import { get } from 'svelte/store';
import { cart } from '../stores/cart';
import { fetchWithAuth } from './auth';
import { address, formaEntrega, barrio, ciudad } from '../stores/pedido';

// Obtiene la fecha actual en formato "YYYY-MM-DD"
function obtenerFechaActual() {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
}

// Inicializa o reinicia el historial si es un nuevo día
function inicializarHistorial() {
    const fechaActual = obtenerFechaActual();
    const fechaHistorial = localStorage.getItem('fecha_historial');

    if (fechaHistorial !== fechaActual) {
        // Si es un nuevo día, limpia el historial y actualiza la fecha en localStorage
        localStorage.setItem('historial_pedido', JSON.stringify({}));
        localStorage.setItem('fecha_historial', fechaActual);
        console.log('Historial de pedidos reiniciado para el nuevo día');
    }
}

// Actualiza el historial de pedidos en localStorage
function actualizarHistorialPedido(pedidoProductosDto) {
    // Asegúrate de que el historial esté inicializado y de la fecha actual
    inicializarHistorial();

    // Obtén el historial actual del localStorage
    let historialPedido = JSON.parse(localStorage.getItem('historial_pedido'));

    // Actualiza las cantidades en el historial para cada producto en el pedido
    pedidoProductosDto.forEach(item => {
        if (historialPedido[item.id]) {
            historialPedido[item.id] += item.cantidad;
        } else {
            historialPedido[item.id] = item.cantidad;
        }
    });

    // Guarda el historial actualizado en localStorage
    localStorage.setItem('historial_pedido', JSON.stringify(historialPedido));
}

export async function createPedido() {
    try {
        const carrito = get(cart);

        if (carrito.length === 0) {
            console.warn('El carrito está vacío');
            return;
        }

        const idsProductos = carrito.map(item => item.id);
        const productosData = await getProductosAPedir();
        console.log('Productos obtenidos:', productosData);

        const productosEnCarrito = productosData.filter(producto => idsProductos.includes(producto.id));

        const pedidoProductosDto = carrito.map(item => {
            const producto = productosEnCarrito.find(p => p.id === item.id);
            
            // Definir precio_final en base a la condición
            const precio_final = producto.is_promocion 
            ? producto.precio - producto.precio * producto.descuento / 100 
            : producto.precio;

            return {
                id: producto.id,
                cantidad: item.quantity,
                precio: precio_final,
                nombre_producto: producto.nombre,
                unidad_producto: producto.unidad_producto,
                cantidad_producto: producto.cantidad
            };
        });

        const montoTotal = pedidoProductosDto.reduce((total, item) => total + (item.precio * item.cantidad), 0);
        const pedido = {
            monto_total: montoTotal,
            productos: pedidoProductosDto,
            direccion: get(address), // Obtiene el valor actual del store
            forma_entrega: get(formaEntrega), // Obtiene el valor actual del store
            barrio: get(barrio), // Obtiene el valor actual del store
            ciudad: get(ciudad), // Obtiene el valor actual del store
        };

        console.log('Datos del pedido:', JSON.stringify(pedido));

        const response = await fetchWithAuth('http://127.0.0.1:5000/api/usuarios/pedidos', {
            method: 'POST',
            body: JSON.stringify(pedido)
        });

        if (response) {
            console.log("Pedido creado con éxito:", response);
            
            // Actualiza el historial de pedidos con los datos actuales del pedido
            actualizarHistorialPedido(pedidoProductosDto);

            // Limpia el carrito
            cart.set([]); // O usa cart.clear() si tienes esa función en el store

            return response.id_pedido;
        } else {
            throw new Error('Error al crear el pedido: respuesta no válida');
        }
        
    } catch (error) {
        console.error('Error al crear el pedido:', error.message || error);
        throw error;
    }
}
