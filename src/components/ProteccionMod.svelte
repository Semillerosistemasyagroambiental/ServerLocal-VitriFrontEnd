<script>
    import { onMount } from "svelte";
    import { currentPath, updatePath } from '../stores/menu.js';
    import { fetchUserProfile } from '../api/user.js';
    import { user } from '../stores/user.js'; // Store para guardar los datos del usuario
    import { getPedidosPendientes } from '../api/pedidoAdmin.js'; // Importa la función de la API

    let errorMessage = ''; // Para manejar errores
    let userProfile = {};
    
    // Llamar a la función de usuarios al montar el componente
    onMount(async () => {
        try {
            userProfile = await fetchUserProfile();
            user.set(userProfile); // Guardar los datos en el store
        } catch (error) {
            console.error('No se pudo obtener el perfil del usuario:', error);
        }

        // INICIO DE PROTECCION DE RUTA🛡️
        // REQUISITOS let userProfile = {}; E IMPORTAR {fetchUserProfile}
        // Verifica que userProfile esté definido antes de acceder a sus propiedades
        if (userProfile && userProfile.nombres) {
            if (userProfile.rol === "MOD") {
                console.log("Acceso concedido a MOD"); // si es admin no redirige 
            } else {
                console.log("Redirigiendo a la ruta principal");
                window.location.href = '/'; // no es admin redirige a home
            }
        } else {
            console.log("Perfil de usuario no disponible");
            window.location.href = '/'; // Redirigir si no hay perfil
        }
        // FIN DE PROTECCION DE RUTA🛡️

    });

</script>

