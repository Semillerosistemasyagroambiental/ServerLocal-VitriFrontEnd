import { fetchWithAuth } from './auth'; // Verifica que la ruta sea correcta
import Swal from "sweetalert2";

// FETCH salidas 🚩...

export async function getEntradas() {
    try {
        const salidas = await fetchWithAuth('https://vitri-api.ocloudev.lat/api/admin/entradas');
        return salidas;
    } catch (error) {
        console.error('Error fetching salidas:', error);
        throw error;
    }
}


