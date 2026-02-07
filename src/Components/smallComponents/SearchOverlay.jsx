import { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export default function SearchOverlay({ onClose }) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await axios.get(API_URL);
      setProducts(data);
    }
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[999] p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <input
          autoFocus
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-lg outline-none border-b pb-2"
        />

        <button className="cursor-pointer" onClick={onClose}>
          <X />
        </button>
      </div>

      {/* Results */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {query && filtered.length === 0 && (
          <p className="text-gray-500">No results found.</p>
        )}

        {filtered.map((p) => (
          <motion.div key={p.id} variants={cardVariants} whileHover={{ y: -3 }}>
            <Link
              to={`/product/${p.id}`}
              onClick={onClose}
              className="flex items-center gap-4 border-b pb-3"
            >
              <img src={p.image} className="w-14 h-18 object-cover rounded" />
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-gray-500">₹{p.price}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
