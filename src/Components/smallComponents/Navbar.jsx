import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, CircleUser, ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchOverlay from "./SearchOverlay";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.25);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const transparentNavbar = isHome && !scrolled;

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${
          transparentNavbar
            ? "bg-white/10 backdrop-blur-md text-white"
            : "bg-white text-black shadow-sm"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative
          ${
            transparentNavbar
              ? "border-b border-white/20"
              : "border-b border-neutral-200"
          }`}
        >
          {/* LEFT */}
          <nav className="hidden md:flex gap-6 text-sm uppercase tracking-wide">
            <Link to="/women">Women</Link>
            <Link to="/men">Men</Link>
          </nav>

          {/* HAMBURGER */}
          <button
            className="md:hidden relative z-[60] w-8 h-8 flex flex-col justify-center items-center"
            onClick={() => setOpen((v) => !v)}
          >
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className={`w-6 h-[2px] rounded ${
                transparentNavbar ? "bg-white" : "bg-black"
              }`}
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className={`w-6 h-[2px] my-1 rounded ${
                transparentNavbar ? "bg-white" : "bg-black"
              }`}
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className={`w-6 h-[2px] rounded ${
                transparentNavbar ? "bg-white" : "bg-black"
              }`}
            />
          </button>

          {/* LOGO */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 font-bold tracking-[0.25em]"
          >
            <h1>KAVYASS</h1>
          </Link>

          {/* ICONS */}
          <div className="flex gap-4 items-center">
            <button onClick={() => setSearchOpen(true)}>
              <Search
                size={20}
                className={transparentNavbar ? "text-white" : "text-black"}
              />
            </button>

            {searchOpen && (
              <SearchOverlay onClose={() => setSearchOpen(false)} />
            )}

            <Link to="/account">
              <CircleUser
                size={20}
                className={transparentNavbar ? "text-white" : "text-black"}
              />
            </Link>

            <Link to="/cart">
              <ShoppingCart
                size={20}
                className={transparentNavbar ? "text-white" : "text-black"}
              />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= MOBILE OVERLAY (ROOT LEVEL) ================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-white md:hidden"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute top-3 left-5 p-2"
            >
              <X size={28} className="text-black" />
            </button>

            {/* MENU CONTENT */}
            <div className="pt-[72px] px-6">
              <nav className="flex flex-col gap-6 text-lg uppercase tracking-wide">
                {["Women", "Men"].map((label) => (
                  <Link
                    key={label}
                    to={`/${label.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className="border-b pb-2"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
