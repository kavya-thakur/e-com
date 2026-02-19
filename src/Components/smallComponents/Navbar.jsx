import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, CircleUser, ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "../../Context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";
  const { cart } = useCart();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.25);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const transparentNavbar = isHome && !scrolled;
  const themeClass = transparentNavbar ? "text-white" : "text-black";

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out
        ${transparentNavbar ? "bg-transparent" : "bg-white/80 backdrop-blur-lg shadow-sm"}`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative border-b transition-colors duration-500
          ${transparentNavbar ? "border-white/10" : "border-neutral-100"}`}
        >
          {/* LEFT: Links with animated underline */}
          <nav className="hidden md:flex gap-8 text-[11px] font-medium uppercase tracking-[0.2em]">
            {["Women", "Men"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className={`relative group transition-opacity hover:opacity-70 ${themeClass}`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* MOBILE HAMBURGER */}
          <button
            className="md:hidden relative z-[60] w-8 h-8 flex flex-col justify-center items-center"
            onClick={() => setOpen((v) => !v)}
          >
            <motion.span
              animate={open ? { rotate: 45, y: 1 } : { rotate: 0, y: -4 }}
              className={`absolute w-5 h-[1.5px] transition-colors ${open ? "bg-black" : transparentNavbar ? "bg-white" : "bg-black"}`}
            />
            <motion.span
              animate={open ? { rotate: -45, y: 1 } : { rotate: 0, y: 4 }}
              className={`absolute w-5 h-[1.5px] transition-colors ${open ? "bg-black" : transparentNavbar ? "bg-white" : "bg-black"}`}
            />
          </button>

          <Link
            to="/"
            className={`absolute left-1/2 -translate-x-1/2 font-bold text-lg tracking-[0.4em] transition-colors duration-500 ${themeClass}`}
          >
            <h1>KAVYASS</h1>
          </Link>

          {/* RIGHT: Icons with hover lift */}
          <div className={`flex gap-3 items-center ${themeClass}`}>
            <motion.button
              whileHover={{ y: -2 }}
              onClick={() => setSearchOpen(true)}
              className="hover:opacity-60 transition-opacity"
            >
              <Search size={20} strokeWidth={1.5} />
            </motion.button>

            {searchOpen && (
              <SearchOverlay onClose={() => setSearchOpen(false)} />
            )}

            <motion.div whileHover={{ y: -2 }}>
              <Link
                to="/account"
                className="hover:opacity-60 transition-opacity"
              >
                <CircleUser size={20} strokeWidth={1.5} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }}>
              <Link
                to="/cart"
                className="relative inline-flex items-center justify-center p-1 hover:opacity-60 transition-opacity"
              >
                <ShoppingCart size={22} strokeWidth={1.5} />{" "}
                {/* Slightly larger icon for mobile touch */}
                <AnimatePresence>
                  {cart.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      // Using translate classes for perfect centering regardless of icon size
                      className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 
                     bg-black text-white dark:bg-white dark:text-black
                     text-[9px] font-bold w-4 h-4 flex items-center justify-center 
                     rounded-full z-10 border border-white dark:border-black"
                    >
                      {cart.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[1001] bg-white md:hidden flex flex-col p-6"
          >
            <div className="flex justify-end w-full">
              <button
                onClick={() => setOpen(false)}
                className="p-2 cursor-pointer hover:bg-neutral-100 rounded-full transition-colors active:scale-90"
                aria-label="Close menu"
              >
                <X size={30} strokeWidth={1.5} className="text-black" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-4">
              <nav className="flex flex-col gap-8 text-4xl font-light uppercase tracking-tighter text-black">
                {["Women", "Men", "Account", "Cart"].map((label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={`/${label.toLowerCase()}`}
                      onClick={() => setOpen(false)}
                      className="block cursor-pointer hover:text-neutral-500 transition-colors active:translate-x-2 duration-300"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-10 border-t border-neutral-100"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
                © KAVYASS 2026
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
