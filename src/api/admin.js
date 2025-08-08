import { fetchWithAuth } from './auth'; // Verifica que la ruta sea correcta

// Función para obtener cantidad de pedidos total
export async function getPedidosIndex() {
    try {
      // Realiza la solicitud a la API para obtener todos los pedidos
      const pedidos = await fetchWithAuth('http://127.0.0.1:5000/api/admin/pedidos');

      // Devuelve el número de pedidos pendientes
      return pedidos.length;
    } catch (error) {
      // Lanza el error para que pueda ser manejado por quien use la función
      throw new Error('Error');
    }
  }

  // Función para obtener cantidad de productos total
  export async function getProductosIndex() {
    try {
      // Realiza la solicitud a la API para obtener todos los productos
      const productos = await fetchWithAuth('http://127.0.0.1:5000/api/admin/productos');
  
      // Devuelve el número de productos pendientes
      return productos.length;
    } catch (error) {
      // Lanza el error para que pueda ser manejado por quien use la función
      throw new Error('Error');
    }
  }

  // Función para obtener cantidad de categorias total
  export async function getCategoriasIndex() {
    try {
      // Realiza la solicitud a la API para obtener todos los productos
      const productos = await fetchWithAuth('http://127.0.0.1:5000/api/admin/categorias');
  
      // Devuelve el número de productos pendientes
      return productos.length;
    } catch (error) {
      // Lanza el error para que pueda ser manejado por quien use la función
      throw new Error('Error');
    }
  }

  // Función para obtener cantidad de categorias total
  export async function getUsuariosIndex() {
    try {
      // Realiza la solicitud a la API para obtener todos los productos
      const productos = await fetchWithAuth('http://127.0.0.1:5000/api/admin/usuarios');
  
      // Devuelve el número de productos pendientes
      return productos.length;
    } catch (error) {
      // Lanza el error para que pueda ser manejado por quien use la función
      throw new Error('Error');
    }
  }