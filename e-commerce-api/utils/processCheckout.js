import { getCart } from "./cart.js";
import supabase from "./supabase.js";

const exampleCart = new Map([
  [2, 2],
  [3, 5],
  [4, 5],
]);

async function calculateTotal(cart) {
  const productIds = Array.from(cart.keys());
  const productsQuery = supabase
    .from("products")
    .select("*")
    .in("id", productIds);

  const { data, error } = await productsQuery;
  if (error) {
    throw error;
  }

  console.log(data);
}

async function processCheckout(userId) {
  // Get cart contents
  const cart = await getCart(userId);
}
