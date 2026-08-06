/**
 * BeYuumi API service layer.
 *
 * All network calls live here (single source of truth) so the same backend
 * logic can be reused by the web app and a future React Native client.
 * Components and hooks only consume the typed helpers below — no raw fetch
 * calls should appear in UI code.
 */
import {
  GET_RESTAURANTS,
  FETCH_MENU_URL,
  RESTAURANT_CATEGORY_MAP,
} from "../config";

const DEFAULT_TIMEOUT_MS = 12000;

const timeout = (ms) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out. Please try again.")), ms)
  );

/** Low-level fetch wrapper shared by every endpoint. */
export const http = async (url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) => {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const signal = controller?.signal;

  const res = await Promise.race([
    fetch(url, { ...options, signal }),
    timeout(timeoutMs),
  ]);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
};

/* ---------------- restaurants (home feed) ---------------- */

/**
 * Fetch the list of restaurants. Falls back to an empty array on failure so
 * the UI can decide how to present it (offline banner vs error state).
 */
export const getRestaurants = async () => {
  const json = await http(GET_RESTAURANTS);

  const categories = (json?.categories || []).filter(
    (category) => category.strCategory !== "Beef"
  );

  const mapped =
    categories.length > 0
      ? categories.slice(0, 10).map((category, index) => ({
          info: {
            id: String(550055 + index),
            name: category.strCategory,
            cloudinaryImageId: category.strCategoryThumb,
            locality: category.strCategory,
            areaName: category.strCategory,
            costForTwo: "₹300 for two",
            cuisines: [category.strCategory],
            avgRating: 4.2,
            parentId: String(10000 + index),
            avgRatingString: "4.2",
            totalRatingsString: `${1000 + index * 100}+`,
            promoted: false,
          },
        }))
      : json?.data?.cards?.[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants || [];

  if (mapped.length === 0) {
    throw new Error("No restaurants in response");
  }
  return mapped;
};

/* ---------------- restaurant menu ---------------- */

/** Resolve which TheMealDB category backs a restaurant id. */
export const getCategoryForRestaurant = (resid) =>
  RESTAURANT_CATEGORY_MAP[String(resid)] || "Vegetarian";

/**
 * Fetch the menu for a restaurant (TheMealDB meals) and normalize into the
 * shape the menu page renders. Kept inside the service so the data contract
 * can be swapped for the real backend without touching UI code.
 */
export const getMenu = async (resid) => {
  const category = getCategoryForRestaurant(resid);
  const url = FETCH_MENU_URL + encodeURIComponent(category);
  const json = await http(url);

  const meals = json?.meals || [];
  if (meals.length === 0) {
    throw new Error("No meals returned from TheMealDB");
  }

  const mealCards = meals.map((meal) => ({
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

  return {
    cards: [
      { card: { card: { info: { name: "Menu", avgRatingString: "4.0" } } } },
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
              cloudinaryImageId: meals[0].strMealThumb,
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
                { card: { card: { itemCards: mealCards } } },
              ],
            },
          },
        },
      },
    ],
  };
};

/* ---------------- auth (already centralized in utils/auth.js) ---------------- */
export { loginUser, registerUser, fetchProfile, getToken, getUser, setAuth, clearAuth } from "../../utils/auth";

export default { http, getRestaurants, getMenu, getCategoryForRestaurant };