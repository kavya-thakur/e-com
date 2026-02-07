import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className=" relative bg-white text-neutral-900">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-14 grid grid-cols-1 md:grid-cols-4 gap-10 ">
        {/* BRAND */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Link to="/">
            <h1 className="text-4xl text-red md:text-5xl font-serif tracking-tight">
              KAVYASS
            </h1>
          </Link>

          <p className="mt-4 text-sm text-neutral-500 leading-relaxed max-w-xs">
            A modern luxury label — minimal silhouettes, refined fabrics, and
            timeless craftsmanship for everyday living.
          </p>
        </motion.div>

        {/* SHOP */}
        <FooterColumn
          title="SHOP"
          links={[
            { label: "Women", to: "/women" },
            { label: "Men", to: "/men" },
          ]}
        />

        {/* COLLECTIONS */}
        <FooterColumn
          title="COLLECTIONS"
          links={[
            { label: "Ready to wear", to: "/#readytowear" },
            { label: "New Collection", to: "/#new-collection" },
            { label: "Fashion Collection", to: "/#fashion-collection" },
          ]}
        />

        {/* SUPPORT */}
        <FooterColumn
          title="SUPPORT"
          links={[
            { label: "Contact", to: "/contact" },
            { label: "Shipping", to: "/shipping" },
            { label: "Returns", to: "/returns" },
          ]}
        />
      </div>

      {/* BOTTOM */}
      <div className=" max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between text-xs text-neutral-500 gap-3 mb-10 md:mb-40">
        <p>© 2025 Kavyass — All Rights Reserved.</p>

        <div className="flex gap-6">
          <FooterLegal label="Privacy Policy" to="/privacy" />
          <FooterLegal label="Terms" to="/terms" />
          <FooterLegal label="Cookies" to="/cookies" />
        </div>
      </div>
      <div className="absolute  w-full text-center bottom-0 translate-y-[65%] md:translate-y-[45%] lg:translate-y-[75%]">
        <h1 className="tracking-wider text-[clamp(4rem,20vw,18rem)] text-red opacity-90 font-bold ">
          KAVYASS
        </h1>
      </div>
    </footer>
  );
}

/* ----- Reusable Components ----- */

function FooterColumn({ title, links }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h4 className="text-sm font-medium mb-3 tracking-wide text-red">
        {title}
      </h4>

      <ul className="space-y-2 text-sm">
        {links.map((link, i) => (
          <motion.li
            key={i}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 280 }}
          >
            <Link to={link.to} className="text-neutral-500 hover:text-black">
              {link.label}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function FooterLegal({ label, to }) {
  return (
    <motion.span whileHover={{ y: -2 }}>
      <Link to={to} className="cursor-pointer">
        {label}
      </Link>
    </motion.span>
  );
}
