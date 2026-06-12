import { useState, useEffect } from "react";
import { FETCH_MENU_URL, RESTAURANT_CATEGORY_MAP } from "../Src/config";

const useRestaurant = (resid) => {
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resid) {
      setLoading(false);
      return;
    }

    const getRestaurantInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const category = RESTAURANT_CATEGORY_MAP[String(resid)] || "Vegetarian";
        const url = FETCH_MENU_URL + encodeURIComponent(category);

        console.log("====================================");
        console.log("Fetching URL:", url);
        console.log("Restaurant ID:", resid);
        console.log("Category:", category);
        console.log("====================================");

        const response = await fetch(url);

        console.log("Response Status:", response.status);
        console.log("Response OK:", response.ok);

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const json = await response.json();

        console.log("Parsed JSON:");
        console.log(json);

        console.log("Parsed JSON:");
        console.log(json);

        if (!json?.meals || json.meals.length === 0) {
          throw new Error("No meals returned from TheMealDB");
        }

        const mealCards = json.meals.map((meal) => ({
          card: {
            info: {
              id: meal.idMeal,
              name: meal.strMeal,
              price: 20000 + Math.floor(Math.random() * 20000),
              ratings: { aggregatedRating: (3.5 + Math.random() * 1.5).toFixed(1) },
              cloudinaryImageId: meal.strMealThumb,
            },
          },
        }));

        const mealData = {
          cards: [
            { card: { card: { info: { name: "Menu", avgRatingString: "4.0" } } } } ,
            { card: { card: {} } },
            {
              card: {
                card: {
                  info: {
                    id: resid,
                    name: `Category: ${category}`,
                    city: "Unknown",
                    areaName: category,
                    avgRatingString: "4.2",
                    costForTwoMessage: "₹350 for two",
                    locality: category,
                    cloudinaryImageId: json.meals[0].strMealThumb,
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
                            itemCards: mealCards,
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

        setRestaurant(mealData);
      } catch (err) {
        console.error("Fetch Failed:");
        console.error(err);

        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getRestaurantInfo();
  }, [resid]);

  return {
    restaurant,
    error,
    loading,
  };
};

export default useRestaurant;