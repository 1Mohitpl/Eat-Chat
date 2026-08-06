import { useState, useEffect } from "react";
import { getMenu } from "../Src/services/api";

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
        const mealData = await getMenu(resid);
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