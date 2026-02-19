import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Search as SearchIcon } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

export default function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await axios.get(API_URL);
        setProducts(data);
      } catch (err) {
        console.error("Search fetch failed", err);
      }
    }
    fetchProducts();

    // Lock Body Scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const filtered = query.trim()
    ? products.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[10000] flex flex-col text-black"
    >
      {/* SEARCH HEADER */}
      <div className="w-full border-b border-neutral-100 bg-white sticky top-0 z-[10001]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6 flex items-center gap-4">
          <SearchIcon size={20} className="text-neutral-900" />
          <input
            autoFocus
            placeholder="SEARCH KAVYASS..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-lg md:text-2xl outline-none bg-transparent font-normal tracking-tight text-black placeholder:text-neutral-300 uppercase"
          />
          <button
            className="p-1 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X size={28} strokeWidth={1.2} className="text-black" />
          </button>
        </div>
      </div>

      {/* RESULTS AREA */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <AnimatePresence mode="wait">
            {query && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 flex justify-between items-end border-b border-neutral-50 pb-2"
              >
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold">
                  Results ({filtered.length})
                </h2>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12"
          >
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.div
                  key={p.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ y: -5 }}
                >
                  <Link
                    to={`/product/${p.id}`}
                    onClick={onClose}
                    className="group flex flex-col h-full cursor-pointer"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-neutral-50 mb-3 rounded-sm">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-[10px] md:text-[11px] leading-tight uppercase tracking-widest font-semibold text-neutral-900 line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-[10px] md:text-[12px] text-neutral-500 font-light">
                        ₹{Number(p.price).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {query && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-neutral-400 font-light text-xs tracking-[0.2em] uppercase">
                No matching items found
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}
