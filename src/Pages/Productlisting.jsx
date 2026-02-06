import axios from "axios";
import { useEffect, useState, useMemo, useRef, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../Components/smallComponents/ProductCard";

const API_URL = "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products";
const TTL = 5 * 60 * 1000;

// ✅ memory cache per gender
const memoryCache = {};

function ProductListing({ gender, title, categories }) {
  const CACHE_KEY = `products_${gender}`;

  // ✅ initialize from cache instead of empty
  const [products, setProducts] = useState(() => {
    if (memoryCache[gender]) return memoryCache[gender];

    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return [];

    const parsed = JSON.parse(cached);
    return parsed.data || parsed;
  });

  // ✅ only show shimmer if no data
  const [loading, setLoading] = useState(() => products.length === 0);
  const [error, setError] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // ✅ if already cached in memory, do nothing
    if (memoryCache[gender]) return;

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const isFresh = parsed.timestamp && Date.now() - parsed.timestamp < TTL;

      if (isFresh) {
        memoryCache[gender] = parsed.data;
        setProducts(parsed.data);
        setLoading(false);
        return;
      }
    }

    async function fetchProducts() {
      try {
        const { data } = await axios.get(API_URL);
        if (!mountedRef.current) return;

        const list = data.filter((p) => p.gender === gender);

        memoryCache[gender] = list;

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: list,
            timestamp: Date.now(),
          })
        );

        setProducts(list);
        setLoading(false);
      } catch (err) {
        if (!mountedRef.current) return;
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    }

    setLoading(true);
    fetchProducts();

    return () => {
      mountedRef.current = false;
    };
  }, [gender]);

  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return products;
    return products.filter((p) =>
      selectedCategories.includes(p.category.toLowerCase())
    );
  }, [products, selectedCategories]);

  const handleCategory = useCallback((category) => {
    const normalized = category.toLowerCase();
    setSelectedCategories((prev) =>
      prev.includes(normalized)
        ? prev.filter((c) => c !== normalized)
        : [...prev, normalized]
    );
  }, []);

  /* 🔽 EVERYTHING BELOW IS YOUR ORIGINAL UI (UNCHANGED) 🔽 */

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-[245px_1fr] gap-4">
        <aside className="hidden md:block border border-neutral-200 p-4 rounded-2xl">
          <div className="h-5 w-28 skeleton shimmer rounded mb-4" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-24 skeleton shimmer rounded mb-2" />
          ))}
        </aside>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-200 bg-white/60 backdrop-blur-sm shadow-sm p-3 space-y-4 skeleton-card"
            >
              <div className="w-full h-64 rounded-xl skeleton shimmer" />
              <div className="h-4 w-3/4 skeleton shimmer rounded" />
              <div className="h-4 w-1/3 skeleton shimmer rounded" />
            </div>
          ))}
        </div>
      </div>
    );

  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  function CategoryCheckboxes({ categories }) {
    return categories.map((c) => (
      <motion.label
        whileTap={{ scale: 0.96 }}
        key={c}
        className="flex items-center gap-3 mb-2 cursor-pointer px-1"
      >
        <input
          type="checkbox"
          className="h-4 w-4 accent-black"
          checked={selectedCategories.includes(c.toLowerCase())}
          onChange={() => handleCategory(c)}
        />
        <span className="text-sm">{c}</span>
      </motion.label>
    ));
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 110, damping: 20 },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:grid-cols-[245px_1fr] gap-4 grid">
      <aside className="hidden md:block border p-4 rounded-2xl">
        <h2 className="mb-3 font-medium">{title}</h2>
        <CategoryCheckboxes categories={categories} />
      </aside>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((p) => (
            <motion.div
              key={p.id}
              layout
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              <ProductCard {...p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {/* ================= MOBILE FILTER BUTTON ================= */}
      <div className="fixed bottom-3 left-0 right-0 px-4 md:hidden z-40">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowFilters(true)}
          className="
      w-full py-3 rounded-full
      bg-white
      border border-neutral-300
      text-neutral-800 text-sm font-medium
      shadow-[0_6px_18px_rgba(0,0,0,0.08)]
      tracking-wide
    "
        >
          Filters
        </motion.button>
      </div>

      {/* ================= MOBILE FILTER OVERLAY ================= */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 md:hidden"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
            >
              <div className="w-12 h-1 bg-gray-300 mx-auto rounded-full mb-5" />

              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              <CategoryCheckboxes categories={categories} />

              <button
                onClick={() => setShowFilters(false)}
                className="mt-6 w-full py-3 rounded-full bg-black text-white"
              >
                Apply Filters
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(ProductListing);
