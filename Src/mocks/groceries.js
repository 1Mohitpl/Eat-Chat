// Grocery catalog for InstaFresh — prices in paise.
// All image URLs verified live against themealdb ingredient CDN.
export const INGREDIENT_CDN = "https://www.themealdb.com/images/ingredients/";

const img = (name) => `${INGREDIENT_CDN}${name}.png`;

export const CATEGORIES = [
  "All",
  "Fruits & Veg",
  "Dairy & Eggs",
  "Snacks",
  "Beverages",
  "Staples",
];

export const PRODUCTS = [
  { id: "gf-1", name: "Broccoli", unit: "500 g", price: 5500, mrp: 7000, category: "Fruits & Veg", image: img("Broccoli") },
  { id: "gf-2", name: "Potatoes", unit: "1 kg", price: 4500, mrp: 5500, category: "Fruits & Veg", image: img("Potatoes") },
  { id: "gf-3", name: "Red Onions", unit: "1 kg", price: 3900, mrp: 4800, category: "Fruits & Veg", image: img("Red%20Onions") },
  { id: "gf-4", name: "Carrots", unit: "500 g", price: 3000, mrp: 3600, category: "Fruits & Veg", image: img("Carrots") },
  { id: "gf-5", name: "Bananas", unit: "6 pcs", price: 4200, mrp: 5000, category: "Fruits & Veg", image: img("Banana") },
  { id: "gf-6", name: "Apples", unit: "4 pcs", price: 9900, mrp: 12000, category: "Fruits & Veg", image: img("Apple") },
  { id: "gf-7", name: "Full Cream Milk", unit: "1 L", price: 6600, mrp: 7200, category: "Dairy & Eggs", image: img("Milk") },
  { id: "gf-8", name: "Farm Eggs", unit: "12 pcs", price: 8400, mrp: 9600, category: "Dairy & Eggs", image: img("Eggs") },
  { id: "gf-9", name: "Salted Butter", unit: "200 g", price: 5800, mrp: 6200, category: "Dairy & Eggs", image: img("Butter") },
  { id: "gf-10", name: "Greek Yogurt", unit: "400 g", price: 7500, mrp: 9000, category: "Dairy & Eggs", image: img("Yogurt") },
  { id: "gf-11", name: "White Bread", unit: "400 g", price: 3500, mrp: 4000, category: "Snacks", image: img("Bread") },
  { id: "gf-12", name: "Dark Chocolate Bar", unit: "100 g", price: 8500, mrp: 9990, category: "Snacks", image: img("Chocolate") },
  { id: "gf-13", name: "Salted Peanuts", unit: "250 g", price: 4900, mrp: 5500, category: "Snacks", image: img("Peanuts") },
  { id: "gf-14", name: "Orange Juice", unit: "1 L", price: 11500, mrp: 13500, category: "Beverages", image: img("Orange%20Juice") },
  { id: "gf-15", name: "Black Tea", unit: "25 bags", price: 12500, mrp: 15000, category: "Beverages", image: img("Tea") },
  { id: "gf-16", name: "Sparkling Water", unit: "750 ml", price: 6500, mrp: 7500, category: "Beverages", image: img("Water") },
  { id: "gf-17", name: "Basmati Rice", unit: "1 kg", price: 14900, mrp: 17500, category: "Staples", image: img("Rice") },
  { id: "gf-18", name: "Whole Wheat Flour", unit: "1 kg", price: 6500, mrp: 7500, category: "Staples", image: img("Flour") },
  { id: "gf-19", name: "Vegetable Oil", unit: "1 L", price: 13900, mrp: 15500, category: "Staples", image: img("Vegetable%20Oil") },
  { id: "gf-20", name: "Honey", unit: "500 g", price: 18900, mrp: 22500, category: "Staples", image: img("Honey") },
];
