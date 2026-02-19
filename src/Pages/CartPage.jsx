import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../Context/CartContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const CartSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20 animate-pulse">
    <div className="lg:col-span-2 space-y-10">
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-6 pb-10 border-b border-neutral-300">
          <div className="w-24 h-32 md:w-32 md:h-40 bg-neutral-300 rounded-sm" />
          <div className="flex-1 space-y-4 py-2">
            <div className="h-4 w-1/2 bg-neutral-300 rounded" />
            <div className="h-3 w-1/4 bg-neutral-200 rounded" />
            <div className="h-8 w-24 bg-neutral-200 rounded-full mt-auto" />
          </div>
        </div>
      ))}
    </div>
    <div className="h-80 bg-neutral-200 rounded-sm border border-neutral-200" />
  </div>
);

export default function Cart() {
  const { cart, dispatch } = useCart();
  const [loading, setLoading] = useState(true);

  // Logic remains identical to your original
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

  // Simulate a smooth initial load to prevent "flicker"
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-5 pb-20 min-h-[80vh] font-sans">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl md:text-6xl font-light tracking-tighter uppercase mb-12 text-black"
      >
        Shopping Bag
      </motion.h1>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loader" exit={{ opacity: 0 }}>
            <CartSkeleton />
          </motion.div>
        ) : cart.length === 0 ? (
          /* EMPTY STATE */
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-64 h-80 bg-neutral-50 rounded-sm mb-8 overflow-hidden relative">
              <img
                src="./empty.png"
                className="w-full h-full object-cover grayscale opacity-60"
                alt="empty cart"
              />
            </div>
            <h3 className="text-xl md:text-2xl font-light uppercase tracking-widest text-black">
              Your bag is empty
            </h3>
            <Link
              to="/"
              className="mt-8 text-[10px] uppercase tracking-[0.3em] bg-black text-white px-10 py-4 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Explore Collection
            </Link>
          </motion.div>
        ) : (
          /* CART CONTENT */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20"
          >
            {/* LEFT — CART ITEMS */}
            <div className="lg:col-span-2 space-y-10">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.id + (item.size || "")}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-6 pb-10 border-b border-neutral-100 group"
                  >
                    <div className="w-24 h-32 md:w-32 md:h-40 bg-neutral-50 flex-shrink-0 overflow-hidden rounded-sm">
                      <img
                        src={item.image}
                        className="w-full h-full object-cover"
                        alt={item.title}
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h2 className="text-sm md:text-lg uppercase tracking-tight font-medium text-black">
                            {item.title}
                          </h2>
                          <p className="text-[10px] md:text-xs text-neutral-400 uppercase tracking-widest">
                            Size:{" "}
                            <span className="text-black">
                              {item.size || "—"}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            dispatch({ type: "REMOVE", id: item.id })
                          }
                          className="text-neutral-300 hover:text-red-500 transition-colors cursor-pointer p-1"
                        >
                          <Trash2 size={18} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-neutral-200 rounded-full px-1 py-1">
                          <button
                            onClick={() =>
                              dispatch({ type: "DECREASE", id: item.id })
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 rounded-full cursor-pointer transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-bold w-8 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              dispatch({ type: "ADD", payload: item })
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 rounded-full cursor-pointer transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm md:text-lg font-medium text-black">
                          ₹{(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* RIGHT — SUMMARY */}
            <div className="lg:col-span-1">
              <motion.div className="sticky top-28 p-8 border border-neutral-100 rounded-sm space-y-8 bg-white">
                <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
                  Order Summary
                </h2>
                <div className="space-y-4 border-b border-neutral-50 pb-6">
                  <div className="flex justify-between text-[11px] uppercase tracking-widest text-black">
                    <span className="text-neutral-500 font-light">
                      Subtotal
                    </span>
                    <span className="font-medium">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] uppercase tracking-widest text-black">
                    <span className="text-neutral-500 font-light">
                      Shipping
                    </span>
                    <span className="font-medium">
                      {shipping ? `₹${shipping}` : "Free"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm uppercase tracking-[0.2em] font-bold text-black">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 pt-4">
                  <input
                    placeholder="PROMO CODE"
                    className="flex-1 bg-neutral-50 border-none rounded-sm px-4 py-3 text-[10px] uppercase tracking-widest focus:ring-1 focus:ring-neutral-200 outline-none"
                  />
                  <button className="px-6 py-3 border border-neutral-900 text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-pointer">
                    Apply
                  </button>
                </div>
                <Link to="/checkout" className="block">
                  <button className="w-full bg-black text-white py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 group cursor-pointer">
                    Proceed to Checkout
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </Link>
                <p className="text-[9px] text-neutral-400 text-center uppercase tracking-[0.2em] font-medium italic">
                  Secure checkout • Free returns within 7 days
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
