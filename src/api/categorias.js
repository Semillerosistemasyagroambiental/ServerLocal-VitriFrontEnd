import { fetchWithAuth } from './auth'; // Verifica que la ruta sea correcta

// FETCH CATEGORIAS 🚩...

export async function getCategorias() {
    try {
        const categorias = await fetchWithAuth('https://vitri-api.ocloudev.lat/api/admin/categorias');
        return categorias;  
    } catch (error) {
        console.error('Error fetching categorias:', error);
        throw error;
    }
}


// POST CATEGORIAS 🚩...

// DELETE CATEGORIAS 🚩...