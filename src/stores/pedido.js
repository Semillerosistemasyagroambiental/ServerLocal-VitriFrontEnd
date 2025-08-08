// stores/address.js
import { writable } from 'svelte/store';

export const address = writable('');
export const formaEntrega = writable('');
export const barrio = writable('');
export const ciudad = writable('');