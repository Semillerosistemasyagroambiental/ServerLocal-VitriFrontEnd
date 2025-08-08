import { fetchWithAuth } from './auth'; // Verifica que la ruta sea correcta
import Swal from "sweetalert2";

// FETCH salidas 🚩...

export async function getEntradas() {
    try {
        const salidas = await fetchWithAuth('http://127.0.0.1:5000/api/admin/entradas');
        return salidas;
    } catch (error) {
        console.error('Error fetching salidas:', error);
        throw error;
    }
}


