import { useParams } from "react-router-dom";
import { img_cdn_url } from "../config";
import Shimmer from "./shimmer";
import useRestaurant from "../../utils/useRestaurant";
import { addItem } from "../../utils/cartslice";
import { useDispatch } from "react-redux";

const getImageUrl = (id) =>
  id?.startsWith("http") ? id : `${img_cdn_url}${id}`;

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount || 0);

const RestauFood = () => {
  const { resid } = useParams();
  const { restaurant: restaumenu, loading } = useRestaurant(resid);
  const dispatch = useDispatch();

  const normalizeItem = (info) => ({
    id: info.id,
    name: info.name || "Unknown Food",
    imageId: info.imageId || info.cloudinaryImageId || "",
    price: info.price || info.defaultPrice || 0,
    ratings: info.ratings || {},
  });

  const addFooditem = (item) => {
    const normalizedData = normalizeItem(item.card.info);
    console.log("Adding to cart:", normalizedData);
    dispatch(addItem(normalizedData));
  };

  if (loading) {
    return <Shimmer />;
  }

  if (!restaumenu?.cards?.length) {
    return (
      <div className="p-5 text-center">
        <h2 className="text-xl font-semibold">No restaurant menu available</h2>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  const restauInfo =
    restaumenu.cards.find(
      (card) =>
        card?.card?.card?.["@type"] ===
        "type.googleapis.com/swiggy.presentation.food.v2.Restaurant"
    )?.card?.card?.info || {};

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

  return (
    <div className="menucard max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)] items-start">
        <div className="restauinfo bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 rounded-3xl shadow-2xl">
          {restauInfo?.cloudinaryImageId && (
            <img
              className="w-full h-72 object-cover rounded-3xl mb-5 border border-white/10"
              src={getImageUrl(restauInfo.cloudinaryImageId)}
              alt={restauInfo.name}
            />
          )}
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            {restauInfo?.name || "Restaurant"}
          </h1>
          <p className="text-sm uppercase tracking-[0.2em] text-lime-300 mb-4">
            {restauInfo?.areaName || restauInfo?.locality}
          </p>
          <div className="space-y-3 text-sm text-slate-200">
            {restauInfo?.locality && (
              <p className="flex items-center gap-2">
                <span>📍</span> {restauInfo.locality}
              </p>
            )}
            {restauInfo?.city && <p>City: {restauInfo.city}</p>}
            <p className="flex items-center gap-2">
              <span>⭐</span>
              <span>{restauInfo?.avgRatingString || "N/A"}</span>
              <span className="text-slate-400">{restauInfo?.totalRatingsString || ""}</span>
            </p>
            <p>{restauInfo?.costForTwoMessage}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-5">
            <h2 className="text-2xl font-bold">Menu</h2>
            <p className="text-sm text-slate-300 mt-1">{allItemCards.length} dishes available</p>
          </div>
          <div className="p-6 grid gap-4">
            {allItemCards.length === 0 ? (
              <p className="text-gray-500">No menu items found.</p>
            ) : (
              allItemCards.map((item) => {
                const info = item?.card?.info;
                if (!info) return null;

                const imageUrl = getImageUrl(info.imageId || info.cloudinaryImageId);
                const price = (info.finalPrice || info.price || info.defaultPrice || 0) / 100;
                const rating = info?.ratings?.aggregatedRating?.rating || info?.ratings?.aggregatedRating || "4.0";

                return (
                  <div
                    key={info.id}
                    className="grid gap-4 md:grid-cols-[1fr_120px] items-start rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={info.name}
                            className="w-24 h-24 rounded-3xl object-cover border border-slate-200"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{info.name}</h3>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {info.description || "Taste this delicious dish from the menu."}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1">
                          ⭐ {rating}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1">
                          {formatPrice(price)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addFooditem(item)}
                      className="h-12 rounded-3xl bg-lime-500 text-white font-semibold transition hover:bg-lime-600"
                    >
                      Add to Cart
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestauFood;
