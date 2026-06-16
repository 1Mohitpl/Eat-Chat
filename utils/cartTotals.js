export const DELIVERY_FEE = 4000; // paise (₹40), waived above FREE_DELIVERY_THRESHOLD
export const FREE_DELIVERY_THRESHOLD = 50000; // paise (₹500)
export const TAX_RATE = 0.05;

export const computeCartTotals = (cartItems = []) => {
  const totalItems = cartItems.reduce((s, it) => s + (it.quantity || 1), 0);
  const subtotal = cartItems.reduce(
    (s, it) => s + (Number(it.info.price) || 0) * (it.quantity || 1),
    0
  );
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const tax = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + deliveryFee + tax;
  return { totalItems, subtotal, deliveryFee, tax, grandTotal };
};

export const formatCurrency = (value) => {
  // menu prices are stored in paise; convert to rupees for display
  const inRupees = (Number(value) || 0) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(inRupees);
};
