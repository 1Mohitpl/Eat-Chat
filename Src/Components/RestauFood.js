import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { img_cdn_url, RESTAURANT_CATEGORY_MAP } from "../config";
import Shimmer from "./shimmer";
import useRestaurant from "../../utils/useRestaurant";
import {
  addItem,
  incrementQuantity,
  decrementQuantity,
} from "../../utils/cartslice";
import { useDispatch, useSelector } from "react-redux";

const ACCENT = "#ff6b00";
const NAVY = "#0f172a";

const getImageUrl = (id) =>
  id?.startsWith("http") ? id : `${img_cdn_url}${id}`;

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount || 0));

/* ---------- small shared bits ---------- */

const VegBadge = () => (
  <span className="inline-flex items-center justify-center w-[15px] h-[15px] border-2 border-emerald-500 rounded-[4px] shrink-0 bg-white">
    <span className="w-[7px] h-[7px] bg-emerald-500 rounded-full" />
  </span>
);

const NonVegBadge = () => (
  <span className="inline-flex items-center justify-center w-[15px] h-[15px] border-2 border-red-500 rounded-[4px] shrink-0 bg-white">
    <span className="w-[7px] h-[7px] bg-red-500 rounded-full" />
  </span>
);

const Svg = ({ d, className = "", strokeWidth = 2 }) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const ICON = {
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z",
  clock: "M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  starFilled: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3Z",
  utensils: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  timer: "M10 2h4M12 14l3.5-3.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  chevronDown: "m6 9 6 6 6-6",
  alert: "M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z",
  info: "M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};

/* ---------- heuristics for the mock data ---------- */

const inferVeg = (info, restaurantVeg) => {
  const n = (info?.name || "").toLowerCase();
  if (/(chicken|beef|pork|fish|prawn|salmon|bacon|mutton|lamb|egg|shrimp|turkey)/.test(n))
    return false;
  if (/(paneer|tofu|vegg?|mushroom|pumpkin|potato|salad|spinach|broccoli)/.test(n))
    return true;
  return restaurantVeg;
};

const inferCategory = (name) => {
  const n = (name || "").toLowerCase();
  if (/(drink|juice|shake|smoothie|tea|coffee|soda|lassi|punch|lemonade|cocktail)/.test(n))
    return "Beverages";
  if (/(dessert|cake|sweet|pudding|ice\s*cream|tart|pie|chocolate|jelly|custard|mousse|sundae|cookie|brownie)/.test(n))
    return "Desserts";
  if (/(starter|appetizer|soup|salad|wings|rolls?|skewer|bruschetta|nachos|fries|pakora|samosa|kebab|tikka|kachori|nuggets)/.test(n))
    return "Starters";
  return "Main Course";
};

const CATEGORY_TABS = ["Starters", "Main Course", "Desserts", "Beverages"];

/* ---------- loading skeleton ---------- */

const MenuSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] items-start">
      <div className="rounded-3xl bg-white p-6 shadow-xl space-y-4">
        <div className="h-48 rounded-2xl bg-slate-100 shimmerUI" />
        <div className="h-7 w-2/3 rounded-lg bg-slate-100 shimmerUI" />
        <div className="h-4 w-1/2 rounded bg-slate-100 shimmerUI" />
        <div className="h-4 w-3/4 rounded bg-slate-100 shimmerUI" />
        <div className="h-10 rounded-2xl bg-slate-100 shimmerUI" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-3xl bg-white p-5 shadow-md flex gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-5 w-1/2 rounded bg-slate-100 shimmerUI" />
              <div className="h-4 w-2/3 rounded bg-slate-100 shimmerUI" />
              <div className="h-4 w-1/4 rounded bg-slate-100 shimmerUI" />
            </div>
            <div className="w-28 h-28 rounded-2xl bg-slate-100 shimmerUI shrink-0" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ---------- sidebar (restaurant info + filters) ---------- */

const Sidebar = ({
  restauInfo,
  categoryLabel,
  vegFilter,
  setVegFilter,
  sortBy,
  setSortBy,
  totalDishes,
}) => {
  const name = restauInfo?.name || "Restaurant";
  const area = restauInfo?.areaName || restauInfo?.locality || "";
  const city = restauInfo?.city || "";
  const rating = restauInfo?.avgRatingString || restauInfo?.avgRating || "4.0";
  const ratingCount = restauInfo?.totalRatingsString || "100+ ratings";
  const costForTwo = restauInfo?.costForTwoMessage || "₹300 for two";
  const banner = restauInfo?.cloudinaryImageId
    ? getImageUrl(restauInfo.cloudinaryImageId)
    : null;

  const sortOptions = [
    { value: "popular", label: "Popular" },
    { value: "rating", label: "Top Rated" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  return (
    <aside className="lg:sticky lg:top-24 space-y-5">
      {/* restaurant card */}
      <div className="rounded-3xl bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.25)] ring-1 ring-slate-100 overflow-hidden">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950">
          {banner ? (
            <img
              src={banner}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/40 gap-2">
              <Svg d={ICON.utensils} className="w-12 h-12" />
              <span className="text-xs tracking-widest uppercase">No cover photo</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-emerald-600 text-sm font-bold shadow-md">
              <Svg d={ICON.starFilled} className="w-3.5 h-3.5" fill="currentColor" />
              {rating}
            </span>
            <span className="text-xs text-white/85 font-medium">{ratingCount}</span>
          </div>
        </div>

        <div className="p-5">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
            {name}
          </h1>
          {area && (
            <p className="mt-1 text-sm font-semibold text-[#ff6b00]">{area}</p>
          )}

          <div className="mt-4 space-y-2.5 text-sm text-slate-600">
            {(area || city) && (
              <p className="flex items-start gap-2.5">
                <Svg d={ICON.pin} className="w-4 h-4 text-slate-400 mt-0.5" />
                <span className="leading-snug">
                  {[area, city].filter(Boolean).join(", ")}
                </span>
              </p>
            )}
            <p className="flex items-center gap-2.5">
              <Svg d={ICON.clock} className="w-4 h-4 text-slate-400" />
              <span>Open now · 11:00 AM – 11:00 PM</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Svg d={ICON.timer} className="w-4 h-4 text-slate-400" />
              <span>Delivery in 25–30 mins</span>
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">{costForTwo}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {categoryLabel}
            </span>
          </div>
        </div>
      </div>

      {/* filter / sort card */}
      <div className="rounded-3xl bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] ring-1 ring-slate-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-[#ff6b00]">
            <Svg d={ICON.filter} className="w-4 h-4" />
          </span>
          <h3 className="font-bold text-slate-900">Filter &amp; Sort</h3>
          <span className="ml-auto text-[11px] text-slate-400">{totalDishes} dishes</span>
        </div>

        {/* veg / non-veg */}
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Dietary
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { value: "all", label: "All" },
            { value: "veg", label: "Pure Veg" },
            { value: "nonveg", label: "Non-Veg" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setVegFilter(opt.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95 ${
                vegFilter === opt.value
                  ? "bg-[#ff6b00] text-white shadow-md shadow-orange-200"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200"
              }`}
            >
              {opt.value === "veg" ? <span className="inline-flex items-center gap-1.5"><VegBadge />Veg</span>
               : opt.value === "nonveg" ? <span className="inline-flex items-center gap-1.5"><NonVegBadge />Non-Veg</span>
               : opt.label}
            </button>
          ))}
        </div>

        {/* sort */}
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Sort by
        </p>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none rounded-xl ring-1 ring-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/40 transition-shadow"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Svg
            d={ICON.chevronDown}
            className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>
    </aside>
  );
};

/* ---------- menu item card ---------- */

const MenuItemCard = ({ item, isVeg, qty, onAdd, onInc, onDec }) => {
  const imageUrl = getImageUrl(item.imageId || item.cloudinaryImageId || "");
  const price = (item.finalPrice || item.price || item.defaultPrice || 0) / 100;
  const rating =
    item?.ratings?.aggregatedRating?.rating ||
    item?.ratings?.aggregatedRating ||
    item?.ratings?.rating ||
    null;

  return (
    <div className="flex gap-5 p-5 rounded-3xl bg-white shadow-[0_2px_12px_-4px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-12px_rgba(15,23,42,0.18)]">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isVeg ? <VegBadge /> : <NonVegBadge />}
          {rating && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
              <Svg d={ICON.starFilled} className="w-3 h-3 text-emerald-500" fill="currentColor" />
              {rating}
            </span>
          )}
        </div>

        <h3 className="mt-1.5 font-display font-bold text-[1.02rem] text-slate-900 leading-snug">
          {item.name}
        </h3>

        {item.description ? (
          <p className="mt-1 text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        ) : null}

        <div className="mt-3 flex items-center gap-2">
          <span className="text-[15px] font-extrabold text-slate-900 tabular-nums">
            {formatPrice(price)}
          </span>
          {item.inStock === false && (
            <span className="text-xs font-medium text-red-500">Sold out</span>
          )}
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end justify-between gap-2 w-28">
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <Svg d={ICON.utensils} className="w-8 h-8" />
            </div>
          )}
        </div>

        {qty === 0 ? (
          <button
            type="button"
            onClick={onAdd}
            className="w-full h-9 rounded-xl bg-emerald-500 text-white text-sm font-bold transition-all duration-200 hover:bg-emerald-600 active:scale-95 shadow-md shadow-emerald-200"
          >
            ADD +
          </button>
        ) : (
          <div className="w-full h-9 rounded-xl bg-white ring-1 ring-emerald-500 flex items-center justify-between px-1 shadow-md shadow-emerald-100">
            <button
              type="button"
              onClick={onDec}
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-600 font-bold hover:bg-emerald-50 active:scale-90 transition-all"
            >
              <Svg d={ICON.minus} className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
            <span
              key={qty}
              className="min-w-[24px] text-center text-sm font-extrabold text-emerald-600 tabular-nums"
              style={{ animation: "cartPop 0.25s ease" }}
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={onInc}
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-600 font-bold hover:bg-emerald-50 active:scale-90 transition-all"
            >
              <Svg d={ICON.plus} className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- empty / error states ---------- */

const EmptyMenu = ({ query, hasFilters }) => (
  <div className="py-16 flex flex-col items-center text-center px-6">
    <span className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
      <Svg d={ICON.info} className="w-8 h-8" />
    </span>
    <h3 className="font-display text-lg font-bold text-slate-800">
      {query ? `No results for "${query}"` : "No dishes found"}
    </h3>
    <p className="text-sm text-slate-500 mt-1 max-w-sm">
      {hasFilters
        ? "Try adjusting your filters or search term."
        : "This restaurant has not added any dishes yet."}
    </p>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <span className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
        <Svg d={ICON.alert} className="w-8 h-8" />
      </span>
      <h2 className="font-display text-xl font-bold text-slate-800">
        Couldn't load this menu
      </h2>
      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        {message || "Something went wrong while fetching the restaurant. Please try again."}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold transition-all duration-200 active:scale-95 hover:translate-y-[-1px]"
        style={{ background: ACCENT, boxShadow: "0 8px 24px rgba(255,107,0,0.3)" }}
      >
        Browse Restaurants
      </Link>
    </div>
  </div>
);

/* ---------- main component ---------- */

const RestauFood = () => {
  const { resid } = useParams();
  const { restaurant: restaumenu, loading, error } = useRestaurant(resid);
  const dispatch = useDispatch();
  const cartItems = useSelector((store) => store.cart.items || []);

  const [search, setSearch] = useState("");
  const [vegFilter, setVegFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [activeCategory, setActiveCategory] = useState("All");

  /* ---- all hooks run unconditionally (before any early return) ---- */

  const restauInfo = useMemo(() => {
    if (!restaumenu?.cards?.length) return {};
    return (
      restaumenu.cards.find(
        (card) =>
          card?.card?.card?.["@type"] ===
          "type.googleapis.com/swiggy.presentation.food.v2.Restaurant"
      )?.card?.card?.info || {}
    );
  }, [restaumenu]);

  const items = useMemo(() => {
    if (!restaumenu?.cards?.length) return [];
    const regularCards =
      restaumenu.cards.find(
        (card) => card?.groupedCard?.cardGroupMap?.REGULAR
      )?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];

    const allItemCards = [];
    regularCards.forEach((section) => {
      const card = section?.card?.card;
      if (card?.itemCards) {
        allItemCards.push(...card.itemCards);
      }
      if (card?.categories) {
        card.categories.forEach((category) => {
          if (category?.itemCards) {
            allItemCards.push(...category.itemCards);
          }
        });
      }
    });

    const categoryLabel = RESTAURANT_CATEGORY_MAP[String(resid)] || "Restaurant";
    const restaurantVeg = /vegetarian|veg/i.test(categoryLabel);

    const list = allItemCards
      .map((item) => item?.card?.info)
      .filter(Boolean);
    return list.map((info) => ({
      ...info,
      _veg: inferVeg(info, restaurantVeg),
      _category: inferCategory(info.name),
      _price: (info.finalPrice || info.price || info.defaultPrice || 0) / 100,
      _rating: Number(
        info?.ratings?.aggregatedRating?.rating ||
          info?.ratings?.aggregatedRating ||
          0
      ),
    }));
  }, [restaumenu, resid]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    items.forEach((it) => {
      counts[it._category] = (counts[it._category] || 0) + 1;
    });
    return counts;
  }, [items]);

  const visibleTabs = CATEGORY_TABS.filter((c) => categoryCounts[c]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let result = items.filter((it) => {
      if (vegFilter === "veg" && !it._veg) return false;
      if (vegFilter === "nonveg" && it._veg) return false;
      if (activeCategory !== "All" && it._category !== activeCategory)
        return false;
      if (q && !it.name.toLowerCase().includes(q)) return false;
      return true;
    });

    if (sortBy === "rating") result = [...result].sort((a, b) => b._rating - a._rating);
    else if (sortBy === "price-low") result = [...result].sort((a, b) => a._price - b._price);
    else if (sortBy === "price-high") result = [...result].sort((a, b) => b._price - a._price);
    else result = [...result];

    return result;
  }, [items, vegFilter, sortBy, activeCategory, search]);

  const categoryLabel = RESTAURANT_CATEGORY_MAP[String(resid)] || "Restaurant";

  const qtyFor = (id) =>
    cartItems.find((i) => i.info.id === id || i.info.name === id)?.quantity || 0;

  const handleAdd = (item) => {
    dispatch(
      addItem({
        id: item.id,
        name: item.name,
        imageId: item.imageId || item.cloudinaryImageId || "",
        price: item.price || item.defaultPrice || 0,
        ratings: item.ratings || {},
        isVeg: item._veg,
      })
    );
  };

  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === "All") {
      document.getElementById("menu-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const el = document.getElementById(`cat-${cat}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      document.getElementById("menu-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const hasFilters = vegFilter !== "all" || sortBy !== "popular" || activeCategory !== "All" || search !== "";

  if (loading) return <MenuSkeleton />;

  if (error) return <ErrorState message={error.message} />;

  if (!restaumenu?.cards?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorState message="No restaurant menu available. Please try again later." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
      <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] items-start">
        {/* LEFT : sidebar */}
        <div className="order-1">
          <Sidebar
            restauInfo={restauInfo}
            categoryLabel={categoryLabel}
            vegFilter={vegFilter}
            setVegFilter={setVegFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            totalDishes={items.length}
          />
        </div>

        {/* RIGHT : menu */}
        <div className="order-2 min-w-0">
          <div className="rounded-3xl overflow-hidden shadow-[0_10px_40px_-16px_rgba(15,23,42,0.2)] ring-1 ring-slate-100">
            {/* menu header */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 sm:px-8 pt-7 pb-6">
              <div className="pointer-events-none absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
                  backgroundSize: "22px 22px",
                }}
              />
              <div className="relative">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                      Menu
                    </h2>
                    <p className="text-sm text-slate-300 mt-1">
                      {filtered.length} of {items.length} dishes · {categoryLabel}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/20 text-xs font-semibold">
                    <Svg d={ICON.timer} className="w-3.5 h-3.5 text-orange-300" />
                    25–30 mins
                  </span>
                </div>

                {/* search */}
                <div className="mt-5 relative max-w-md">
                  <Svg
                    d={ICON.search}
                    className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search dishes…"
                    className="w-full h-11 pl-10 pr-4 rounded-full bg-white/95 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/60 shadow-lg transition-shadow"
                  />
                </div>
              </div>
            </div>

            {/* category tabs */}
            <div className="flex gap-2 px-6 sm:px-8 py-3.5 overflow-x-auto border-b border-slate-100 bg-white scrollbar-none">
              {["All", ...visibleTabs].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => scrollToCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 active:scale-95 ${
                    activeCategory === cat
                      ? "bg-[#ff6b00] text-white shadow-md shadow-orange-200"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200"
                  }`}
                >
                  {cat}
                  {cat !== "All" && categoryCounts[cat] ? (
                    <span
                      className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        activeCategory === cat ? "bg-white/25" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {categoryCounts[cat]}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>

            {/* item list */}
            <div id="menu-list" className="bg-slate-50/60 px-4 sm:px-6 py-5 space-y-4">
              {filtered.length === 0 ? (
                <EmptyMenu query={search} hasFilters={hasFilters} />
              ) : (
                <>
                  {activeCategory === "All"
                    ? filtered.map((item) => (
                        <MenuItemCard
                          key={item.id}
                          item={item}
                          isVeg={item._veg}
                          qty={qtyFor(item.id)}
                          onAdd={() => handleAdd(item)}
                          onInc={() => dispatch(incrementQuantity(item.id))}
                          onDec={() => dispatch(decrementQuantity(item.id))}
                        />
                      ))
                    : visibleTabs.map((cat) => {
                        const group = filtered.filter((it) => it._category === cat);
                        if (group.length === 0) return null;
                        return (
                          <div key={cat} id={`cat-${cat}`} className="scroll-mt-28">
                            <div className="flex items-center gap-3 mb-3 pt-2">
                              <span className="font-display text-lg font-bold text-slate-800">
                                {cat}
                              </span>
                              <span className="text-xs font-semibold text-slate-400">
                                {group.length} items
                              </span>
                              <div className="flex-1 h-px bg-slate-200" />
                            </div>
                            <div className="space-y-4">
                              {group.map((item) => (
                                <MenuItemCard
                                  key={item.id}
                                  item={item}
                                  isVeg={item._veg}
                                  qty={qtyFor(item.id)}
                                  onAdd={() => handleAdd(item)}
                                  onInc={() => dispatch(incrementQuantity(item.id))}
                                  onDec={() => dispatch(decrementQuantity(item.id))}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestauFood;