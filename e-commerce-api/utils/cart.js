const carts = new Map();

function addToCart(userId, productId, quantity) {
  if (!carts.has(userId)) {
    carts.set(userId, new Map());
  }

  const userCart = carts.get(userId);
  userCart.set(productId, (userCart.get(productId) || 0) + quantity);
  console.log("userCart: ", userCart);
  return userCart;
}

function getCart(userId) {
  const userCart = carts.get(Number(userId));
  if (!userCart) {
    return [];
  }
  console.log("userCart: ", userCart);
  return userCart;
}

function updateCartItem(userId, productId, quantity) {
  const userCart = carts.get(userId);
  if (!userCart) {
    return;
  }
  userCart.set(productId, quantity);
  return userCart;
}

function removeFromCart(userId, productID) {
  const userCart = carts.get(userId);
  if (!userCart) {
    return;
  }
  userCart.delete(productID);
}

function clearCart(userId) {
  carts.delete(userId);
}

export { addToCart, getCart, updateCartItem, removeFromCart, clearCart };
