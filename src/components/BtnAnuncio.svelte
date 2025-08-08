<script>
    // modal Search
    import ModalSearch from '../components/ModalAnuncio.svelte';
    import { isModalOpenAnuncios } from '../stores/modalStore';

    function openModalAnuncios() {
        isModalOpenAnuncios.set(true); // Abre el modal
        
    }
</script>
<main>
<button class="boton-anuncio bg-morado border border-2 border-white" on:click={openModalAnuncios}>
    <span class="material-symbols-outlined pt-1 text-white">campaign</span>
</button>
</main>

<style>
.boton-anuncio{
    animation: expandFade 3s infinite;              
    border:none;
    position: fixed;
    right: 5px;
    bottom: 5px;
    border-radius: 100px;
    width: 55px;
    height: 55px;
    z-index: 9970;
  
}

.bg-morado{
    background-color: #39a900;
}



/* Efecto de desvanecimiento y expansión hacia afuera */
@keyframes expandFade {
        0% {
            box-shadow: 0 0 0 0 #39a900;
        }
        100% {
            box-shadow: 0 0 0px 10px rgba(0, 255, 0, 0);
        }
    }
.material-symbols-outlined {
    font-size: 45px;
    transform: scaleX(-1) rotate(-40deg);
}

@media (max-width: 770px) {
    .boton-anuncio{
        animation: expandFade 3s infinite;              
        border:none;
        position: fixed;
        right: 13px;
        bottom: 65px;
        border-radius: 100px;
        width: 38px;
        height: 38px;
        z-index: 9970;
    }

    .material-symbols-outlined {
        font-size: 28px;
        transform: scaleX(-1) rotate(-40deg);
    }

  }

</style>