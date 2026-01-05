import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b max-w-7xl mx-auto border-neutral-300 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* LEFT — NAV LINKS (desktop) */}
        <nav className="hidden md:flex gap-6 text-sm uppercase tracking-wide">
          <Link to="/women" className="hover:opacity-60">
            Women
          </Link>
          <Link to="/men" className="hover:opacity-60">
            Men
          </Link>
          <Link to="/kids" className="hover:opacity-60">
            Kids
          </Link>
          <Link to="/brands" className="hover:opacity-60">
            Brands
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* CENTER LOGO */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 text-xl tracking-[0.25em] font-bold"
        >
          <h1>KAVYASS</h1>
        </Link>

        {/* RIGHT — ICONS */}
        <div className="flex gap-5 items-center">
          <button aria-label="Search">
            <Search size={20} />
          </button>
          <Link to="/account" aria-label="Account">
            <User size={20} />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist">
            <Heart size={20} />
          </Link>

          <Link to="/cart" className="relative" aria-label="Cart">
            <ShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 text-[10px] bg-black text-white px-1.5 rounded-full">
              2
            </span>
          </Link>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col px-4 py-3 text-sm uppercase">
            <Link
              className="py-2 border-b"
              to="/women"
              onClick={() => setOpen(false)}
            >
              Women
            </Link>
            <Link
              className="py-2 border-b"
              to="/men"
              onClick={() => setOpen(false)}
            >
              Men
            </Link>
            <Link
              className="py-2 border-b"
              to="/kids"
              onClick={() => setOpen(false)}
            >
              Kids
            </Link>
            <Link className="py-2" to="/brands" onClick={() => setOpen(false)}>
              Brands
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
