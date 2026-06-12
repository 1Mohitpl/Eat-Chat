import { img_cdn_url } from "../config";

const RestaurantCard = ({
  cloudinaryImageId,
  name,
  locality,
  areaName,
  costForTwo,
  totalRatingsString,
  avgRating,
}) => {
  const imageUrl = cloudinaryImageId?.startsWith("http")
    ? cloudinaryImageId
    : img_cdn_url + cloudinaryImageId;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
      
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full shadow-md flex items-center gap-1">
          <span className="text-green-600 font-bold">
            ⭐ {avgRating}
          </span>
        </div>
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

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300">
            View Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

