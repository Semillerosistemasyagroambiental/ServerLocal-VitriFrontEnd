// src/stores/modalStore.js
import { writable } from 'svelte/store';

export const isModalOpen = writable(false);

export const isModalOpenPedidos = writable(false);

export const isModalOpenPedidosMod = writable(false);

export const isModalOpenSearch = writable(false);

export const isModalOpenAnuncios = writable(false);

export const idStore = writable(null);
