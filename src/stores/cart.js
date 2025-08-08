import { writable, derived } from 'svelte/store';

// Cargar el carrito del localStorage o inicializar vacío
const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
export const cart = writable(storedCart);

// Guardar el carrito en el localStorage cada vez que cambia
cart.subscribe(value => {
  localStorage.setItem('cart', JSON.stringify(value));
});

// Contar el número total de productos (considerando cantidades)
export const totalProducts = derived(cart, $cart =>
  $cart.reduce((total, item) => total + item.quantity, 0)
);

// Contar el número de productos diferentes en el carrito
export const productCount = derived(cart, $cart => $cart.length);

// Calcular el monto total de los productos en el carrito
export const totalAmount = derived(cart, $cart =>
  $cart.reduce((total, item) => {
    const precio_final = item.is_promocion 
      ? item.precio - item.precio * item.descuento / 100 
      : item.precio;

    console.log(`Producto: ${item.nombre}, Cantidad: ${item.quantity}, Precio Final: ${precio_final}`);
    return total + item.quantity * precio_final;
  }, 0)
);

// Función para añadir un producto al carrito
export function addToCart(producto) {
  cart.update(items => {
    const existingItem = items.find(item => item.id === producto.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({ ...producto, quantity: 1 });
    }
    return items;
  });
}

// Incrementar la cantidad de un producto
export function incrementQuantity(productoId) {
  cart.update(items => {
    const item = items.find(item => item.id === productoId);
    if (item) {
      item.quantity += 1;
    }
    return items;
  });
}

// Decrementar la cantidad de un producto
export function decrementQuantity(productoId) {
  cart.update(items => {
    let itemsUpdated = items;
    const item = items.find(item => item.id === productoId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
    } else {
      itemsUpdated = items.filter(item => item.id !== productoId);
    }
    return itemsUpdated;
  });
}

// Vaciar el carrito
export function vaciarCarrito() {
  localStorage.removeItem('cart');
  cart.set([]);
}
