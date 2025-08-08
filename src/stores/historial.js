// Archivo historial.js

// Obtiene la fecha actual en formato "YYYY-MM-DD"
function obtenerFechaActual() {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
}

// Inicializa el historial si no existe o reinicia si es un nuevo día
function verificarFechaHistorial() {
    const fechaActual = obtenerFechaActual();
    const fechaHistorial = localStorage.getItem('fecha_historial');

    // Crear historial si no existe o si es un nuevo día
    if (!localStorage.getItem('historial_pedido') || fechaHistorial !== fechaActual) {
        localStorage.setItem('historial_pedido', JSON.stringify({}));
        localStorage.setItem('fecha_historial', fechaActual);
        console.log('Historial de pedidos inicializado o reiniciado para el nuevo día');
    }
}

// Llama a la verificación de fecha inmediatamente al cargar el módulo
verificarFechaHistorial();

export function actualizarHistorialPedido(pedidoProductosDto) {
    let historialPedido = JSON.parse(localStorage.getItem('historial_pedido'));

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

export { obtenerFechaActual, verificarFechaHistorial };
