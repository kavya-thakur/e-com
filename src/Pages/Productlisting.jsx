import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { wait } from "../Components/utils/wait";
import { motion } from "framer-motion";
import ProductCard from "../Components/smallComponents/ProductCard";

const API_URL = "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products";

export default function ProductListing({ gender, title, categories }) {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const TTL = 5 * 60 * 1000; // 5 minutes

  const CACHE_KEY = `products_${gender}`;

  useEffect(() => {
    let canceled = false;

    async function fetchProducts() {
      setLoading(true);

      // 1️⃣ use cache first
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        const parsed = JSON.parse(cached);

        // OLD format (array only)
        if (Array.isArray(parsed)) {
          await wait(350);
          setProducts(parsed);
          setLoading(false);
        }
        // NEW format (object with timestamp + data)
        else {
          await wait(350);
          setProducts(parsed.data);
          setLoading(false);
        }
      }

      try {
        const cached = localStorage.getItem(CACHE_KEY);
        const parsed = cached ? JSON.parse(cached) : null;

        const isFresh = parsed && Date.now() - parsed.timestamp < TTL;

        // ⛔ don't call API if cache still valid
        if (isFresh) return;

        // ✅ only fetch when data is old or missing
        const { data } = await axios.get(API_URL);

        if (canceled) return;

        const list = data.filter((p) => p.gender === gender);

        setProducts(list);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: list,
            timestamp: Date.now(),
          })
        );
      } catch (err) {
        if (!canceled) setError("Something went wrong. Please try again.");
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    fetchProducts();
    return () => (canceled = true);
  }, [gender]);

  // 3️⃣ derive filtered list instead of storing duplicate state
  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return products;

    return products.filter((p) =>
      selectedCategories.includes(p.category.toLowerCase())
    );
  }, [products, selectedCategories]);

  const handleCategory = (category) => {
    const normalized = category.toLowerCase();
    setSelectedCategories((prev) =>
      prev.includes(normalized)
        ? prev.filter((c) => c !== normalized)
        : [...prev, normalized]
    );
  };

  // ----------------- SKELETON -----------------
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
      <label
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
      </label>
    ));
  }
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
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
    <div className="max-w-7xl mx-auto px-4 py-10 md:px-0 grid md:grid-cols-[245px_1fr] gap-4">
      {/* Sidebar */}
      <aside className="hidden md:block border p-4 rounded-2xl">
        <h2 className="mb-3 font-medium">{title}</h2>
        <CategoryCheckboxes categories={categories} />
      </aside>

      {/* Grid */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
      >
        {filteredProducts.map((p) => (
          <motion.div
            key={p.id}
            variants={cardVariants}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.18 }}
          >
            <ProductCard {...p} />
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile filters */}
      <div className="fixed bottom-3 left-0 right-0 px-4 md:hidden z-40">
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
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

      {showFilters && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setShowFilters(false)}
        >
          <div
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
          </div>
        </div>
      )}
    </div>
  );
}
