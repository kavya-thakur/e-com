import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, CircleUser, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchOverlay from "./SearchOverlay";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white ">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative border-b border-neutral-300">
        {/* LEFT — DESKTOP NAV */}
        <nav className="hidden md:flex gap-6 text-sm uppercase tracking-wide">
          <Link to="/women" className="hover:opacity-60">
            Women
          </Link>
          <Link to="/men" className="hover:opacity-60">
            Men
          </Link>
        </nav>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden relative z-[60] w-8 h-8 flex flex-col justify-center items-center"
          onClick={() => setOpen((v) => !v)}
        >
          {/* top bar */}
          <motion.span
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-6 h-[2px] bg-black rounded origin-center"
          />
          {/* middle bar */}
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-[2px] bg-black rounded my-1"
          />
          {/* bottom bar */}
          <motion.span
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-6 h-[2px] bg-black rounded origin-center"
          />
        </button>

        {/* CENTER LOGO */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 text-xl tracking-[0.25em] font-bold"
        >
          <h1>KAVYASS</h1>
        </Link>

        {/* RIGHT ICONS */}
        <div className="flex gap-4 items-center ">
          <button
            className="cursor-pointer"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} />
          </button>
          {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

          <Link to="/account" aria-label="Account">
            <CircleUser size={20} />
          </Link>

          <Link to="/cart" className="relative" aria-label="Cart">
            {/* <ShoppingBag size={20} /> */}
            <ShoppingCart size={20} />
          </Link>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
            className="fixed inset-0 bg-white pt-24 px-6 md:hidden z-40"
          >
            <motion.nav
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 },
                },
              }}
              className="flex flex-col gap-4 text-lg uppercase tracking-wide"
            >
              {["Women", "Men"].map((label) => (
                <motion.div
                  key={label}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    to={`/${label.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className="py-2 border-b"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
