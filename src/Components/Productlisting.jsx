import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../Components/ProductCard";

const API_URL = "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products";

export default function ProductListing({ gender, title, categories }) {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const { data } = await axios.get(API_URL);
        const list = data.filter((p) => p.gender === gender);
        setProducts(list);
        setFilterProducts(list);
        console.log("Total products:", list.length);
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [gender]);

  const handleCategory = (category) => {
    const normalized = category.toLowerCase();

    setSelectedCategories((prev) =>
      prev.includes(normalized)
        ? prev.filter((c) => c !== normalized)
        : [...prev, normalized]
    );
  };

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilterProducts(products);
      return;
    }

    const filtered = products.filter((p) =>
      selectedCategories.includes(p.category.toLowerCase())
    );

    setFilterProducts(filtered);
  }, [selectedCategories, products]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  //   HELPER FUNCTION IS HERE FOR CATEGORIES MAPPING
  function CategoryCheckboxes({ categories, selectedCategories, onToggle }) {
    return (
      <>
        {categories.map((c) => (
          <label
            key={c}
            className="flex items-center gap-3 mb-2 cursor-pointer px-1"
          >
            <input
              type="checkbox"
              className="h-4 w-4 accent-black cursor-pointer"
              checked={selectedCategories.includes(c.toLowerCase())}
              onChange={() => onToggle(c)}
            />
            <span className="text-sm">{c}</span>
          </label>
        ))}
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 md:px-0 grid md:grid-cols-[245px_1fr] gap-4">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block  border-[#F1F0E8] border p-4 rounded-2xl">
        <h2 className="mb-3 font-medium">{title}</h2>
        <CategoryCheckboxes
          categories={categories}
          selectedCategories={selectedCategories}
          onToggle={handleCategory}
        />
      </aside>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
        {filterProducts.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>

      {/* Mobile filter button */}
      <div className="fixed bottom-3 left-0 right-0 px-4 md:hidden z-40">
        <button
          onClick={() => setShowFilters(true)}
          className="w-full py-3 rounded-full bg-black text-white text-sm shadow-lg"
        >
          Filters
        </button>
      </div>

      {/* Mobile bottom sheet */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setShowFilters(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
          >
            <div className="w-12 h-1 bg-gray-300 mx-auto rounded-full mb-5"></div>

            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <CategoryCheckboxes
              categories={categories}
              selectedCategories={selectedCategories}
              onToggle={handleCategory}
            />

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
