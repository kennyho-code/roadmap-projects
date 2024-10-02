import { getCart } from "./cart.js";
import supabase from "./supabase.js";

async function calculateTotal(cart) {
  const productIds = Array.from(cart.keys());
  const productsQuery = supabase
    .from("products")
    .select("*")
    .in("id", productIds);

  const { data: productList, error } = await productsQuery;
  if (error) {
    throw error;
  }

  const productsMap = productList.reduce((map, product) => {
    map.set(product.id, product);
    return map;
  }, new Map());

  let totalPrice = 0;
  Array.from(cart.entries()).forEach(([productId, quantity]) => {
    const price = productsMap.get(productId).price * quantity;
    totalPrice += price;
  });

  return totalPrice.toFixed(2);
}

function calculateShippingCost() {
  return 10.0;
}

function getShippingInfo() {
  const fakeAddress = {
    firstName: "John",
    lastName: "Doe",
    streetAddress: "123 Maple Street",
    apartment: "Apt 4B",
    city: "Springfield",
    state: "IL",
    zipCode: "62704",
    country: "United States",
    phoneNumber: "(555) 123-4567",
    email: "john.doe@email.com",
  };

  return fakeAddress;
}
function createOrder(totalPrice, shippingInfo, shippingCost) {
  const fakeOrder = {
    orderId: "ORD-9876-XYZW",
    orderDate: "2023-06-10T14:30:00Z",
    customer: {
      id: "CUST-5678",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@email.com",
      phoneNumber: "(555) 234-5678",
    },
    billingAddress: {
      streetAddress: "789 Pine Lane",
      apartment: "Unit 12",
      city: "Rivertown",
      state: "NY",
      zipCode: "12345",
      country: "United States",
    },
    shippingAddress: {
      streetAddress: "101 Maple Road",
      apartment: "Apt 45",
      city: "Hillsville",
      state: "NY",
      zipCode: "12346",
      country: "United States",
    },
    items: [
      {
        productId: "PROD-111",
        name: "Smartphone XS",
        quantity: 1,
        price: 799.99,
        subtotal: 799.99,
      },
      {
        productId: "PROD-222",
        name: "Protective Case",
        quantity: 2,
        price: 29.99,
        subtotal: 59.98,
      },
      {
        productId: "PROD-333",
        name: "Screen Protector",
        quantity: 1,
        price: 19.99,
        subtotal: 19.99,
      },
    ],
    paymentMethod: {
      type: "Credit Card",
      cardType: "Visa",
      lastFourDigits: "1234",
    },
    shippingMethod: "Standard Shipping",
    subtotal: 879.96,
    shippingCost: 15.0,
    taxAmount: 71.99,
    totalAmount: 966.95,
    currency: "USD",
    orderStatus: "Processing",
    estimatedDeliveryDate: "2023-06-17",
    notes: "Please ring doorbell upon delivery.",
  };
  return fakeOrder;
}

async function processCheckout(userId) {
  // Get cart contents
  // const cart = await getCart(userId);
  const cart = new Map();
  const userMap = new Map([
    [2, 2],
    [3, 5],
    [4, 5],
  ]);
  cart.set(3, userMap);

  const userCart = cart.get(userId);
  const totalPrice = await calculateTotal(userCart);
  const shippingInfo = getShippingInfo();
  const shippingCost = calculateShippingCost();
  const order = createOrder(totalPrice, shippingInfo, shippingCost);

  // createOrder
}

export default processCheckout;
