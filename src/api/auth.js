// src/api/auth.js
import { user } from '../stores/user';
import { vaciarCarrito } from '../stores/cart';
// Función para guardar el token en localStorage
export function saveToken(token) {
    localStorage.setItem('access_token', token);
}

// Función para obtener el token desde localStorage
export function getToken() {
    return localStorage.getItem('access_token');
}

// Función para realizar el login y guardar el token
export async function login(credentials) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            const data = await response.json();
            saveToken(data.access_token);
            return data;
        } else {
            throw new Error('Login fallido');
        }
    } catch (error) {
        console.error('Error en el login:', error);
        throw error;
    }
}

// Función genérica para realizar solicitudes autenticadas
export async function fetchWithAuth(url, options = {}) {
    const token = getToken();

    if (!token) {
        throw new Error('No hay token disponible');
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const text = await response.text(); // Obtener el cuerpo de la respuesta como texto
        return text ? JSON.parse(text) : null; // Si la respuesta no está vacía, intenta analizarla como JSON
    } else {
        const errorMessage = await response.text();
        console.error(`Error en la solicitud: ${response.status} ${response.statusText}: ${errorMessage}`);
        throw new Error(errorMessage || 'Error en la solicitud');
    }
}

//POST Función cerrar sesión🚩...

export async function logout() {
    vaciarCarrito() 
    try {
        // Obtener el token de acceso desde localStorage
        const token = localStorage.getItem('access_token');

        // Realizar la solicitud de logout al backend con el token en el encabezado
        const response = await fetch('http://127.0.0.1:5000/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Enviar el token en los encabezados
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            // Limpiar el token y los datos del usuario
            localStorage.removeItem('access_token');
            user.set(null); // Limpiar la tienda de usuario

            // Redirigir al usuario a la página de inicio de sesión
            window.location.href = '/login';
        } else {
            console.error('Error al intentar cerrar sesión:', response.statusText);
        }
    } catch (error) {
        console.error('Error en el logout:', error.message || error);
    }
}



//POST Función para crear un nuevo usuario 🚩...

export async function createUser(userData) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            return await response.json();
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage || 'Error al crear el usuario');
        }
    } catch (error) {
        console.error('Error en la creación del usuario:', error);
        throw error;
    }
}
