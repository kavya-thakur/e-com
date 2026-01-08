import axios from "axios";
import React, { useEffect, useState } from "react";
import { wait } from "../utils/wait";
import ProductCard from "../smallComponents/ProductCard";

const CACHE_KEY = "new_collection_cache";

const NewCollection = () => {
  const [Products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;

    const fetchingProducts = async () => {
      setLoading(true);

      // 1️⃣ Try cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        await wait(350);
        setProducts(JSON.parse(cached));
        setLoading(false);
        return;
      }

      // 2️⃣ Fetch only if not cached
      try {
        const res = await axios.get(
          "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products"
        );

        if (canceled) return;

        const sliced = res.data.slice(17, 25);

        setProducts(sliced);
        setLoading(false);

        // 3️⃣ Save to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(sliced));
      } catch (err) {
        if (!canceled) setLoading(false);
      }
    };

    fetchingProducts();

    // 4️⃣ Cleanup
    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div className="min-h-screen max-w-7xl mx-auto pt-10 md:pt-20 relative">
      {/* HERO */}
      <div className="flex flex-col-reverse lg:flex-row gap-4 relative p-4 ">
        <img
          className="h-[70vh] w-full object-cover rounded-xl md:h-[85vh] md:w-fit"
          src="./newcollection.png"
          alt=""
        />

        <div className="absolute px-4 md:px-5 bottom-13 md:bottom-20 text-white/70 font-light text-3xl md:text-[2.8rem] leading-none capitalize tracking-tighter">
          <h4>Premium fabrics, </h4>
          <h4>timeless silhouettes,</h4>
          <h4>effortless everyday elegance.</h4>
        </div>

        <div className="text-5xl tracking-tighter font-serif leading-none md:text-6xl relative w-full">
          <h3>NEW</h3>
          <h3>COLLECTION</h3>

          <img
            className="h-[45vh] hidden rounded-xl lg:block md:w-fit absolute bottom-0"
            src="./newcollection2.png"
            alt=""
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
                className="rounded-2xl border border-gray-200/60 bg-white/60 backdrop-blur-sm shadow-sm p-3 space-y-4 skeleton-card"
              >
                <div className="w-full h-64 rounded-xl skeleton shimmer" />
                <div className="space-y-2 px-1">
                  <div className="h-4 w-3/4 rounded skeleton shimmer" />
                  <div className="h-4 w-1/2 rounded skeleton shimmer" />
                </div>
                <div className="h-4 w-1/3 rounded skeleton shimmer" />
              </div>
            ))
          : Products.map((p) => <ProductCard key={p.id} {...p} />)}
      </div>
    </div>
  );
};

export default NewCollection;
