import React, { useEffect, useState, useRef, memo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../smallComponents/ProductCard";
import TextReveal from "../smallComponents/Textsplit";

const CACHE_KEY = "new_arrivals_cache";
let memoryCache = null; // ✅ in-memory cache

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const NewArrival = () => {
  const [products, setProducts] = useState(() => {
    if (memoryCache) return memoryCache;

    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(() => products.length === 0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (products.length > 0) return; // ✅ already have data, don’t refetch

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products"
        );

        if (!mountedRef.current) return;

        const sliced = res.data.slice(8, 16);

        memoryCache = sliced; // ✅ save in memory
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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center my-10">
        <TextReveal
          text="READY TO WEAR"
          className="font-semibold tracking-tighter text-3xl md:text-5xl"
        />
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200/60 bg-white/60 p-3 space-y-4"
              >
                <div className="w-full h-64 rounded-xl skeleton shimmer" />
                <div className="space-y-2 px-1">
                  <div className="h-4 w-3/4 skeleton shimmer" />
                  <div className="h-4 w-1/2 skeleton shimmer" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="products"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {products.map((p) => (
              <motion.div key={p.id} variants={itemVariants}>
                <ProductCard {...p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default memo(NewArrival);
