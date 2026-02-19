import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ id, title, image, price, rating, category }) => {
  return (
    <Link to={`/product/${id}`} className="group block w-full">
      <div className="relative w-full flex flex-col">
        {/* IMAGE CONTAINER: Fixed Aspect Ratio for a clean grid */}
        <div className="aspect-[3/4] w-full overflow-hidden bg-neutral-100 rounded-sm">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:scale-110"
          />

          {/* Subtle Rating Overlay (Optional: cleaner than a bubble) */}
          {rating && (
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] bg-white/90 backdrop-blur-sm text-black px-2 py-1 rounded-full font-bold tracking-tighter">
                ★ {rating}
              </span>
            </div>
          )}
        </div>

        {/* TEXT CONTENT: Minimalist & Spaced */}
        <div className="pt-4 pb-2 space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h2 className="text-[11px] md:text-[12px] font-semibold text-neutral-900 uppercase tracking-wider line-clamp-1 flex-1 group-hover:text-neutral-500 transition-colors">
              {title}
            </h2>
          </div>

          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-light">
            {category}
          </p>

          <div className="pt-1">
            <h2 className="text-neutral-900 text-[12px] md:text-[13px] font-medium tracking-tight">
              ₹{Number(price).toLocaleString()}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
