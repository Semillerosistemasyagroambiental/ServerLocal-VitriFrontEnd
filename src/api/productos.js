import { fetchWithAuth } from './auth'; // Verifica que la ruta sea correcta
import Swal from "sweetalert2";

// FETCH PRODUCTOS 🚩...

let listProductos = [];
export async function getProductos() {
    try {
        const productos = await fetchWithAuth('https://vitri-api.ocloudev.lat/api/admin/productos');
        return productos;
    } catch (error) {
        console.error('Error fetching productos:', error);
        throw error;
    }
}


export const getProductosAPedir = async () => {
    try {
        const productos = await fetchWithAuth('https://vitri-api.ocloudev.lat/api/publico/productos');
        return productos;
    } catch (error) {
        console.error('Error fetching productos:', error);
        throw error;
    }
};



// DELETE PRODUCTOS 🚩...

export async function eliminarProducto(id) {
    try {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        });
        
        if (result.isConfirmed) {
            const response = await fetchWithAuth(`https://vitri-api.ocloudev.lat/api/admin/productos/${id}`, {
                method: 'DELETE',
            });

            // Si la respuesta es nula o vacía, aún considerar la eliminación como exitosa
            if (response || response === null) {
                listProductos = listProductos.filter(producto => producto.id !== id);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: '¡Eliminado!',
                    text: 'El producto ha sido eliminado.',
                    showConfirmButton: false,
                    timer: 1500
                });
                // Recargar la página después de eliminar el producto
                location.reload();
            }
        }
    } catch (error) {
        Swal.fire(
            'Error',
            `Hubo un problema al eliminar el producto: ${error.message || error}`,
            'error'
        );
    }
}




// POST PRODUCTOS 🚩...

