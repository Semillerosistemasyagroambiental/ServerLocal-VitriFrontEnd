<script>
  import { isModalOpenSearch } from "../stores/modalStore.js";
  import SearchMovile from "./SearchMovile.svelte";

  function handleClickOutside(event) {
    if (event.target.classList.contains("modal")) {
      isModalOpenSearch.set(false); // Cierra el modal
    }
  }
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="modal" class:open={$isModalOpenSearch} on:click={handleClickOutside} role="dialog" aria-modal="true">
  <div class="modal-content">
    <div class="col mb-4">
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="close position-absolute text-center" on:click={() => isModalOpenSearch.set(false)}>&times;</div>
    </div>
    <div class="col mt-n4 text-end">
      <SearchMovile/>
    </div>

  </div>
</div>

<style>
  .modal {
    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.686);
  }

  .modal.open {
    display: block;
  }

  .modal-content {
  background-color: transparent;
  padding-top: 10px;
  padding-left: 10%;
  padding-right: 10%;
  }

  .close {
    color: #707070;
    font-size: 28px;
    font-weight: bold;
    width: 50px;
    top: -1px;
    right: 9.5%;
    z-index: 9999;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>
