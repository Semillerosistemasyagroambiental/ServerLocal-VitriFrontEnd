import { fetchWithAuth } from './auth'; // Verifica que la ruta sea correcta
import Swal from "sweetalert2";

// FETCH pedidos 🚩...

export async function getPedidosAdmin() {
    try {
        const pedidos = await fetchWithAuth('https://vitri-api.ocloudev.lat/api/admin/pedidos');
        return pedidos;
    } catch (error) {
        console.error('Error fetching pedidos:', error);
        throw error;
    }
}

export async function getPedidosMod() {
    try {
        const pedidos = await fetchWithAuth('https://vitri-api.ocloudev.lat/api/mod/pedidos');
        return pedidos;
    } catch (error) {
        console.error('Error fetching pedidos:', error);
        throw error;
    }
}

export async function getMisPedidos() {
    try {
        const pedidos = await fetchWithAuth('https://vitri-api.ocloudev.lat/api/usuarios/pedidos');
        return pedidos;
    } catch (error) {
        console.error('Error fetching pedidos:', error);
        throw error;
    }
}


// Función para obtener pedidos con estado PENDIENTE desde la API
export async function getPedidosPendientes() {
    try {
      // Realiza la solicitud a la API para obtener todos los pedidos
      const pedidos = await fetchWithAuth('https://vitri-api.ocloudev.lat/api/admin/pedidos');
  
      // Filtra los pedidos con estado PENDIENTE
      const pendientes = pedidos.filter(pedido => pedido.estado_pedido === 'PENDIENTE');
  
      // Devuelve el número de pedidos pendientes
      return pendientes.length;
    } catch (error) {
      // Lanza el error para que pueda ser manejado por quien use la función
      throw new Error('Error al obtener los pedidos pendientes: ' + error.message);
    }
  }
  

// DELETE pedidos 🚩...




// POST pedidos 🚩...

