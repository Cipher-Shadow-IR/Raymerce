const CART_KEY = 'raymerce_cart';

export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
};

export const addToCart = (product, qty = 1) => {
  const cart = getCart();
  const index = cart.findIndex((item) => item._id === product._id);

  if (index >= 0) {
    cart[index].qty = Math.min(cart[index].qty + qty, product.stock);
  } else {
    cart.push({ ...product, qty: Math.min(qty, product.stock) });
  }

  saveCart(cart);
  return cart;
};

export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item._id !== id);
  saveCart(cart);
  return cart;
};

export const updateQty = (id, qty) => {
  const cart = getCart();
  const index = cart.findIndex((item) => item._id === id);
  if (index >= 0) {
    cart[index].qty = Math.max(1, Math.min(qty, cart[index].stock));
  }
  saveCart(cart);
  return cart;
};

export const getCartTotal = (cart) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  return { subtotal, itemCount };
};
