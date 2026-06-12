const createMockMenuForRestaurant = (restaurantId) => {
  const menus = {
    "550055": {
      // KFC
      name: "KFC",
      areaName: "Sealdah",
      city: "Kolkata",
      locality: "Sealdah",
      avgRatingString: "4.2",
      costForTwoMessage: "₹400 for two",
      cloudinaryImageId: "rng4dxp73ow6dm4a0zlg",
      items: [
        { id: "1", name: "Crispy Fried Chicken Bucket", price: 35000, rating: "4.8" },
        { id: "2", name: "Zinger Burger", price: 18000, rating: "4.6" },
        { id: "3", name: "Popcorn Chicken", price: 15000, rating: "4.5" },
        { id: "4", name: "Coleslaw", price: 5000, rating: "4.3" },
        { id: "5", name: "Fries", price: 6000, rating: "4.4" },
        { id: "6", name: "Pepsi", price: 4000, rating: "4.2" },
      ],
    },
    "550056": {
      // Pizza Hut
      name: "Pizza Hut",
      areaName: "Elgin",
      city: "Kolkata",
      locality: "Elgin Road",
      avgRatingString: "4.3",
      costForTwoMessage: "₹350 for two",
      cloudinaryImageId: "v0p2zbyob1cvzm2io60b",
      items: [
        { id: "1", name: "Margherita Pizza", price: 29000, rating: "4.7" },
        { id: "2", name: "Pepperoni Pizza", price: 35000, rating: "4.8" },
        { id: "3", name: "Veggie Lovers Pizza", price: 28000, rating: "4.5" },
        { id: "4", name: "Garlic Bread", price: 8000, rating: "4.6" },
        { id: "5", name: "Cheese Dip", price: 6000, rating: "4.4" },
        { id: "6", name: "Coke", price: 4000, rating: "4.3" },
      ],
    },
    "550057": {
      // Barbeque Nation
      name: "Barbeque Nation",
      areaName: "Park Street",
      city: "Kolkata",
      locality: "Park Street",
      avgRatingString: "4.4",
      costForTwoMessage: "₹600 for two",
      cloudinaryImageId: "jkhxj8np8zq1pvu3c7r5",
      items: [
        { id: "1", name: "Tandoori Chicken", price: 32000, rating: "4.8" },
        { id: "2", name: "Mutton Seekh Kebab", price: 40000, rating: "4.9" },
        { id: "3", name: "Grilled Fish", price: 38000, rating: "4.7" },
        { id: "4", name: "Paneer Tikka", price: 28000, rating: "4.6" },
        { id: "5", name: "Butter Naan", price: 8000, rating: "4.5" },
        { id: "6", name: "Mint Raita", price: 5000, rating: "4.4" },
      ],
    },
    "550058": {
      // Burger King
      name: "Burger King",
      areaName: "New Market",
      city: "Kolkata",
      locality: "New Market",
      avgRatingString: "4.4",
      costForTwoMessage: "₹350 for two",
      cloudinaryImageId: "mwv9c4d9x3l2n5k8q9j2",
      items: [
        { id: "1", name: "Whopper", price: 25000, rating: "4.8" },
        { id: "2", name: "Crispy Chicken Burger", price: 22000, rating: "4.7" },
        { id: "3", name: "Aloo Tikki Burger", price: 15000, rating: "4.5" },
        { id: "4", name: "French Fries", price: 6000, rating: "4.4" },
        { id: "5", name: "Onion Rings", price: 7000, rating: "4.6" },
        { id: "6", name: "Coca Cola", price: 4000, rating: "4.3" },
      ],
    },
    "550059": {
      // Domino's Pizza
      name: "Domino's Pizza",
      areaName: "Ballygunge",
      city: "Kolkata",
      locality: "Ballygunge",
      avgRatingString: "4.3",
      costForTwoMessage: "₹300 for two",
      cloudinaryImageId: "p8r3x5t2k9q0w7m4b1n6",
      items: [
        { id: "1", name: "Farmhouse Pizza", price: 26000, rating: "4.7" },
        { id: "2", name: "Indi Tandoori Paneer Pizza", price: 28000, rating: "4.6" },
        { id: "3", name: "Cheese Pizza", price: 22000, rating: "4.5" },
        { id: "4", name: "Garlic Bread", price: 7000, rating: "4.4" },
        { id: "5", name: "Choco Lava Cake", price: 10000, rating: "4.8" },
        { id: "6", name: "Pepsi", price: 4000, rating: "4.2" },
      ],
    },
    "550060": {
      // Subway
      name: "Subway",
      areaName: "Lake Market",
      city: "Kolkata",
      locality: "Lake Market",
      avgRatingString: "4.2",
      costForTwoMessage: "₹250 for two",
      cloudinaryImageId: "c2f5h9j3x7k1m6p0w8n4",
      items: [
        { id: "1", name: "Italian BMT Sandwich", price: 19000, rating: "4.6" },
        { id: "2", name: "Veggie Delite", price: 15000, rating: "4.4" },
        { id: "3", name: "Teriyaki Chicken", price: 18000, rating: "4.5" },
        { id: "4", name: "Paneer Sandwich", price: 16000, rating: "4.7" },
        { id: "5", name: "Cookies", price: 3000, rating: "4.3" },
        { id: "6", name: "Sprite", price: 4000, rating: "4.2" },
      ],
    },
    "550061": {
      // Biryani Blues
      name: "Biryani Blues",
      areaName: "Behala",
      city: "Kolkata",
      locality: "Behala",
      avgRatingString: "4.5",
      costForTwoMessage: "₹300 for two",
      cloudinaryImageId: "d9k2m5t8r3w1x6p4q0j7",
      items: [
        { id: "1", name: "Hyderabadi Chicken Biryani", price: 32000, rating: "4.9" },
        { id: "2", name: "Mutton Biryani", price: 38000, rating: "4.8" },
        { id: "3", name: "Vegetable Biryani", price: 22000, rating: "4.6" },
        { id: "4", name: "Paneer Dum Biryani", price: 28000, rating: "4.7" },
        { id: "5", name: "Raita", price: 5000, rating: "4.4" },
        { id: "6", name: "Sweet Lassi", price: 6000, rating: "4.5" },
      ],
    },
    "550062": {
      // Chai Shai
      name: "Chai Shai",
      areaName: "Gariahat",
      city: "Kolkata",
      locality: "Gariahat",
      avgRatingString: "4.3",
      costForTwoMessage: "₹200 for two",
      cloudinaryImageId: "h7t4p1w8m3q9k2x5r0b6",
      items: [
        { id: "1", name: "Masala Tea", price: 3000, rating: "4.7" },
        { id: "2", name: "Momos", price: 8000, rating: "4.6" },
        { id: "3", name: "Chow Mein", price: 12000, rating: "4.5" },
        { id: "4", name: "Samosa", price: 4000, rating: "4.4" },
        { id: "5", name: "Pakora", price: 6000, rating: "4.3" },
        { id: "6", name: "Fried Rice", price: 11000, rating: "4.5" },
      ],
    },
    "550063": {
      // Haldiram's
      name: "Haldiram's",
      areaName: "Camac Street",
      city: "Kolkata",
      locality: "Camac Street",
      avgRatingString: "4.6",
      costForTwoMessage: "₹250 for two",
      cloudinaryImageId: "f6n1q3t7k0p5m8w2x9r4",
      items: [
        { id: "1", name: "Aloo Paratha", price: 8000, rating: "4.7" },
        { id: "2", name: "Chole Bhature", price: 12000, rating: "4.6" },
        { id: "3", name: "Gulab Jamun", price: 7000, rating: "4.8" },
        { id: "4", name: "Jalebi", price: 5000, rating: "4.7" },
        { id: "5", name: "Samosa", price: 4000, rating: "4.5" },
        { id: "6", name: "Lassi", price: 6000, rating: "4.6" },
      ],
    },
    "550064": {
      // Spice Garden
      name: "Spice Garden",
      areaName: "Koramangala",
      city: "Bangalore",
      locality: "Koramangala, 5th Block",
      avgRatingString: "4.8",
      costForTwoMessage: "₹400 for two",
      cloudinaryImageId: "v8x1t4n6r2p9k3m0w5q7",
      items: [
        { id: "1", name: "Paneer Butter Masala", price: 32000, rating: "4.7" },
        { id: "2", name: "Chicken Biryani", price: 35000, rating: "4.8" },
        { id: "3", name: "Garlic Naan", price: 8000, rating: "4.6" },
        { id: "4", name: "Tandoori Chicken", price: 28000, rating: "4.7" },
        { id: "5", name: "Chole Bhature", price: 18000, rating: "4.5" },
        { id: "6", name: "Shahi Tukda", price: 12000, rating: "4.9" },
      ],
    },
    "565580": {
      // Dosa Garden
      name: "Dosa Garden",
      areaName: "MG Road",
      city: "Bangalore",
      locality: "MG Road, Indiranagar",
      avgRatingString: "4.7",
      costForTwoMessage: "₹300 for two",
      cloudinaryImageId: "a1b2c3d4e5f6g7h8i9j0",
      items: [
        { id: "1", name: "Masala Dosa", price: 15000, rating: "4.8" },
        { id: "2", name: "Butter Dosa", price: 18000, rating: "4.7" },
        { id: "3", name: "Ghee Roast Dosa", price: 20000, rating: "4.9" },
        { id: "4", name: "Idli Sambar", price: 12000, rating: "4.6" },
        { id: "5", name: "Vada Curry", price: 14000, rating: "4.5" },
        { id: "6", name: "Medu Vada", price: 10000, rating: "4.7" },
      ],
    },
  };

  const restaurantMenu = menus[String(restaurantId)] || menus["550064"];

  return {
    cards: [
      { card: { card: {} } },
      { card: { card: {} } },
      {
        card: {
          card: {
            info: {
              id: restaurantId,
              name: restaurantMenu.name,
              city: restaurantMenu.city,
              areaName: restaurantMenu.areaName,
              avgRatingString: restaurantMenu.avgRatingString,
              costForTwoMessage: restaurantMenu.costForTwoMessage,
              locality: restaurantMenu.locality,
              cloudinaryImageId: restaurantMenu.cloudinaryImageId,
            },
          },
        },
      },
      { card: { card: {} } },
      {
        card: { card: {} },
        groupedCard: {
          cardGroupMap: {
            REGULAR: {
              cards: [
                { card: { card: {} } },
                { card: { card: {} } },
                { card: { card: {} } },
                { card: { card: {} } },
                { card: { card: {} } },
                { card: { card: {} } },
                { card: { card: {} } },
                {
                  card: {
                    card: {
                      itemCards: restaurantMenu.items.map((item) => ({
                        card: {
                          info: {
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            ratings: { aggregatedRating: item.rating },
                            cloudinaryImageId: restaurantMenu.cloudinaryImageId,
                          },
                        },
                      })),
                    },
                  },
                },
              ],
            },
          },
        },
      },
    ],
  };
};

export const mockRestaurantMenu = {
  cards: [],
};

export const getRestaurantMenu = createMockMenuForRestaurant;

export default createMockMenuForRestaurant;

