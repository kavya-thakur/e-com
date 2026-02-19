import axios from "axios";
import { useEffect, useState, useMemo, useRef, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../Components/smallComponents/ProductCard";

const API_URL = "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products";
const TTL = 5 * 60 * 1000;
const memoryCache = {};

const PRICE_RANGES = [
  { label: "Under ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
  { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
  { label: "Over ₹10,000", min: 10000, max: Infinity },
];

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

function ProductListing({ gender, title, categories }) {
  const CACHE_KEY = `products_${gender}`;
  const [products, setProducts] = useState(() => {
    if (memoryCache[gender]) return memoryCache[gender];
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached).data || JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(() => products.length === 0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const mountedRef = useRef(true);

  // --- API Fetching Logic ---
  useEffect(() => {
    mountedRef.current = true;
    if (memoryCache[gender]) {
      setLoading(false);
      return;
    }

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < TTL) {
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
        const list = data.filter(
          (p) => p.gender.toLowerCase() === gender.toLowerCase(),
        );
        memoryCache[gender] = list;
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: list, timestamp: Date.now() }),
        );
        setProducts(list);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
    fetchProducts();
    return () => {
      mountedRef.current = false;
    };
  }, [gender]);

  // --- Filter Logic ---
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category.toLowerCase());
      const priceMatch =
        !selectedPrice ||
        (Number(p.price) >= selectedPrice.min &&
          Number(p.price) <= selectedPrice.max);
      return categoryMatch && priceMatch;
    });
  }, [products, selectedCategories, selectedPrice]);

  const handleCategory = useCallback((category) => {
    const normalized = category.toLowerCase();
    setSelectedCategories((prev) =>
      prev.includes(normalized)
        ? prev.filter((c) => c !== normalized)
        : [...prev, normalized],
    );
  }, []);

  if (loading)
    return (
      <div className="py-40 text-center uppercase tracking-widest animate-pulse">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 pb-20 text-black">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter uppercase mb-4">
            {title}
          </h1>
          <div className="flex items-center gap-6 text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400">
            <span>{filteredProducts.length} Items</span>
            {(selectedCategories.length > 0 || selectedPrice) && (
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedPrice(null);
                }}
                className="text-black underline cursor-pointer hover:text-red-500"
              >
                Reset
              </button>
            )}
          </div>
        </motion.div>

        {/* Desktop Price Brackets */}
        <div className="hidden md:flex gap-2">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() =>
                setSelectedPrice(
                  selectedPrice?.label === range.label ? null : range,
                )
              }
              className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${selectedPrice?.label === range.label ? "bg-black text-white" : "border-neutral-200 text-neutral-400 hover:border-black"}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORY NAV (Smooth Layout) */}
      <div className="hidden md:flex gap-3 mb-16 overflow-x-auto no-scrollbar pb-4 border-b border-neutral-100">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => handleCategory(c)}
            className={`px-8 py-2.5 rounded-full text-[11px] uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${selectedCategories.includes(c.toLowerCase()) ? "bg-black text-white" : "bg-neutral-50 text-neutral-500"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID  */}
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

      {/* MOBILE TRIGGER */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 md:hidden z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-3 bg-black text-white px-10 py-4 rounded-full shadow-2xl cursor-pointer"
        >
          <SlidersHorizontal size={16} />
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Filter
          </span>
        </motion.button>
      </div>

      {/* MOBILE DRAWER (Restored Animation) */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[1000] rounded-t-[3rem] p-10 shadow-2xl"
            >
              <div className="flex justify-between mb-10">
                <h3 className="text-xl uppercase tracking-widest font-light">
                  Filters
                </h3>
                <X
                  className="cursor-pointer"
                  onClick={() => setShowFilters(false)}
                />
              </div>
              <div className="space-y-12">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-6 font-bold">
                    Category
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCategory(c)}
                        className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${selectedCategories.includes(c.toLowerCase()) ? "bg-black text-white border-black" : "border-neutral-200 text-neutral-400"}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-6 font-bold">
                    Price
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.label}
                        onClick={() =>
                          setSelectedPrice(
                            selectedPrice?.label === range.label ? null : range,
                          )
                        }
                        className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${selectedPrice?.label === range.label ? "bg-black text-white border-black" : "border-neutral-200 text-neutral-400"}`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="mt-12 w-full py-5 bg-black text-white text-[10px] uppercase tracking-widest rounded-full font-bold"
              >
                Apply
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(ProductListing);
