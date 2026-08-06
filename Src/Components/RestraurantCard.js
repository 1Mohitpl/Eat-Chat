import { img_cdn_url } from "../config";

const imgBase = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/";

/** Build a responsive srcSet + sizes string for Swiggy-style CDN images. */
const buildSrcSet = (cloudinaryImageId) => {
  if (!cloudinaryImageId) return null;
  if (cloudinaryImageId.startsWith("http")) {
    return { src: cloudinaryImageId, srcSet: undefined, sizes: undefined };
  }
  const widths = [200, 400, 660];
  const srcSet = widths
    .map((w) => `${imgBase}w_${w}/${encodeURIComponent(cloudinaryImageId)} ${w}w`)
    .join(", ");
  return {
    src: img_cdn_url + cloudinaryImageId,
    srcSet,
    sizes: "(min-width: 768px) 300px, 100vw",
  };
};

const RestaurantCard = ({
  cloudinaryImageId,
  name,
  locality,
  areaName,
  costForTwo,
  totalRatingsString,
  avgRating,
}) => {
  const img = buildSrcSet(cloudinaryImageId);

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 active:-translate-y-0.5 cursor-pointer">
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={img?.src}
          srcSet={img?.srcSet || undefined}
          sizes={img?.sizes || undefined}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 truncate">
          {name}
        </h2>

        <p className="text-gray-500 text-sm mt-1 truncate">
          {areaName}
        </p>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-gray-600 font-medium">
            {costForTwo}
          </span>
          <span className="text-sm text-gray-500">
            {locality}
          </span>
        </div>

        <div className="mt-3 border-t pt-3 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {totalRatingsString}
          </span>
          <button className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 min-h-[40px]">
            View Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;