import axios from "axios";
import React, { useEffect, useState, useRef, memo } from "react";
import ProductCard from "../smallComponents/ProductCard";

const CACHE_KEY = "new_collection_cache";
let memoryCache = null;

const NewCollection = () => {
  const [products, setProducts] = useState(() => {
    if (memoryCache) return memoryCache;

    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(() => products.length === 0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (products.length > 0) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products"
        );

        if (!mountedRef.current) return;

        const sliced = res.data.slice(17, 25);

        memoryCache = sliced;
        localStorage.setItem(CACHE_KEY, JSON.stringify(sliced));

        setProducts(sliced);
        setLoading(false);
      } catch {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mountedRef.current = false;
    };
  }, [products.length]);

  return (
    <div className="min-h-screen max-w-7xl mx-auto pt-10 md:pt-20 relative">
      {/* HERO */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 relative p-4 ">
        <img
          className="h-[70vh] w-full object-cover rounded-xl md:h-[85vh] md:w-fit"
          src="./newcollection.png"
          alt=""
          loading="lazy"
        />

        <div className="absolute px-4 md:px-5 bottom-13 md:bottom-20 text-white/70 font-light text-3xl md:text-[2.8rem] leading-none capitalize tracking-tighter">
          <h4>Premium fabrics, </h4>
          <h4>timeless silhouettes,</h4>
          <h4>effortless everyday elegance.</h4>
        </div>

        <div className="text-5xl text-red tracking-tighter font-serif leading-none md:text-6xl relative w-full">
          <h3>NEW</h3>
          <h3>COLLECTION</h3>

          <img
            className="h-[45vh] hidden rounded-xl lg:block md:w-fit absolute bottom-0"
            src="./newcollection2.png"
            alt=""
            loading="lazy"
          />

          <div className="hidden lg:block font-light md:text-base tracking-normal absolute right-0 w-88 pt-22">
            <p>
              Our newest collection is an invitation to slow down and rediscover
              the beauty of well-crafted clothing…
            </p>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4 ">
        {loading
          ? [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200/60 bg-white/60 shadow-sm p-3 space-y-4"
              >
                <div className="w-full h-64 rounded-xl skeleton shimmer" />
                <div className="space-y-2 px-1">
                  <div className="h-4 w-3/4 skeleton shimmer" />
                  <div className="h-4 w-1/2 skeleton shimmer" />
                </div>
                <div className="h-4 w-1/3 skeleton shimmer" />
              </div>
            ))
          : products.map((p) => <ProductCard key={p.id} {...p} />)}
      </div>
    </div>
  );
};

export default memo(NewCollection);
