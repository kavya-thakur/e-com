import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ id, title, image, price, rating, category }) => {
  return (
    <Link to={`/product/${id}`}>
      <div
        key={id}
        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden "
      >
        {/* image */}
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover  transition duration-300"
          />
        </div>
        {/* text */}
        <div className="p-4">
          <h2 className="text-sm font-medium text-neutral-800 line-clamp-1">
            {title}
          </h2>

          <p className="text-xs text-neutral-500 capitalize mt-1">{category}</p>

          <div className="flex items-center justify-between mt-3">
            <h2 className=" text-neutral-900 text-sm font-medium">
              Rs. {price}
            </h2>

            {rating && (
              <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                ⭐ {rating}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
