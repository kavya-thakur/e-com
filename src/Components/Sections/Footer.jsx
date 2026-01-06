import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200">
      {/* TOP SECTION — GRID */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* BRAND BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight">
            KAVYASS
          </h1>

          <p className="mt-4 text-sm text-neutral-500 leading-relaxed max-w-xs">
            A modern luxury label — minimal silhouettes, refined fabrics, and
            timeless craftsmanship for everyday living.
          </p>
        </motion.div>

        {/* COLUMN 1 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h4 className="text-sm font-medium mb-3 tracking-wide">SHOP</h4>

          <ul className="space-y-2 text-sm">
            {["Women", "Men"].map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 280 }}
                className="text-neutral-500 hover:text-black cursor-pointer"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* COLUMN 2 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h4 className="text-sm font-medium mb-3 tracking-wide">
            COLLECTIONS
          </h4>

          <ul className="space-y-2 text-sm">
            {[
              "Essentials",
              "Studio Line",
              "Limited Drops",
              "Editorial Picks",
            ].map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 280 }}
                className="text-neutral-500 hover:text-black cursor-pointer"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* COLUMN 3 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-sm font-medium mb-3 tracking-wide">SUPPORT</h4>

          <ul className="space-y-2 text-sm">
            {["Contact", "Shipping", "Returns", "FAQ"].map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 280 }}
                className="text-neutral-500 hover:text-black cursor-pointer"
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* SEPARATOR */}
      <div className="border-t border-neutral-200" />

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between text-xs text-neutral-500 gap-3">
        <p>© 2025 Kavyass — All Rights Reserved.</p>

        <div className="flex gap-6">
          <motion.span whileHover={{ y: -2 }} className="cursor-pointer">
            Privacy Policy
          </motion.span>
          <motion.span whileHover={{ y: -2 }} className="cursor-pointer">
            Terms
          </motion.span>
          <motion.span whileHover={{ y: -2 }} className="cursor-pointer">
            Cookies
          </motion.span>
        </div>
      </div>
    </footer>
  );
}
