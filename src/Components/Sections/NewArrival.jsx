// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { motion, AnimatePresence, easeInOut } from "framer-motion";
// import { wait } from "../utils/wait";
// import ProductCard from "../smallComponents/ProductCard";
// import TextReveal from "../smallComponents/Textsplit";

// const CACHE_KEY = "new_arrivals_cache";

// const NewArrival = () => {
//   const [Products, setProduct] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let canceled = false;

//     const fetchProducts = async () => {
//       setLoading(true);

//       // 1️⃣ READ CACHE FIRST
//       const cached = localStorage.getItem(CACHE_KEY);
//       if (cached) {
//         await wait(350);
//         const parsed = JSON.parse(cached);
//         setProduct(parsed);
//         setLoading(false);
//         return;
//       }

//       // 2️⃣ FETCH ONLY IF NO CACHE
//       try {
//         const res = await axios.get(
//           "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products"
//         );

//         if (canceled) return;

//         const sliced = res.data.slice(8, 16);

//         setProduct(sliced);
//         setLoading(false);

//         // 3️⃣ SAVE TO CACHE
//         localStorage.setItem(CACHE_KEY, JSON.stringify(sliced));
//       } catch (err) {
//         if (!canceled) setLoading(false);
//       }
//     };

//     fetchProducts();

//     // 4️⃣ CLEANUP (prevents state update if unmounted)
//     return () => {
//       canceled = true;
//     };
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto px-4 md:px-0 py-10">
//       <div className="flex justify-between items-center my-10">
//         {/* <h3 className="font-semibold tracking-tighter text-3xl md:text-5xl">
//           READY TO WEAR
//         </h3> */}
//         <TextReveal
//           text="READY TO WEAR"
//           className="font-semibold tracking-tighter text-3xl md:text-5xl"
//         />
//       </div>

//       <AnimatePresence mode="wait">
//         {loading ? (
//           <motion.div
//             key="skeleton"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
//           >
//             {[...Array(8)].map((_, i) => (
//               <div
//                 key={i}
//                 className="rounded-2xl border border-gray-200/60 bg-white/60 backdrop-blur-sm shadow-sm p-3 space-y-4 skeleton-card"
//               >
//                 <div className="w-full h-64 rounded-xl skeleton shimmer" />

//                 <div className="space-y-2 px-1">
//                   <div className="h-4 w-3/4 rounded skeleton shimmer" />
//                   <div className="h-4 w-1/2 rounded skeleton shimmer" />
//                 </div>

//                 <div className="h-4 w-1/3 rounded skeleton shimmer" />
//               </div>
//             ))}
//           </motion.div>
//         ) : (
//           <motion.div
//             key="products"
//             initial="hidden"
//             animate="visible"
//             variants={{
//               hidden: { opacity: 0, y: 10 },
//               visible: {
//                 opacity: 1,
//                 y: 0,
//                 transition: { staggerChildren: 0.06 },
//               },
//             }}
//             className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
//           >
//             {Products.map((p) => (
//               <motion.div
//                 key={p.id}
//                 variants={{
//                   hidden: { opacity: 0, y: 40 },
//                   visible: {
//                     opacity: 1,
//                     y: 0,
//                     transition: {
//                       type: "spring",
//                       damping: 18,
//                       stiffness: 120,
//                       duration: 0.3,
//                       ease: easeInOut,
//                     },
//                   },
//                 }}
//               >
//                 <ProductCard {...p} />
//               </motion.div>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default NewArrival;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { wait } from "../utils/wait";
import ProductCard from "../smallComponents/ProductCard";
import TextReveal from "../smallComponents/Textsplit";

const CACHE_KEY = "new_arrivals_cache";

/* ---------------- PREMIUM MOTION PRESETS ---------------- */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: "easeOut",
    },
  },
};

/* -------------------------------------------------------- */

const NewArrival = () => {
  const [Products, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let canceled = false;

    const fetchProducts = async () => {
      setLoading(true);

      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        await wait(350);
        if (!canceled) {
          setProduct(JSON.parse(cached));
          setLoading(false);
        }
        return;
      }

      try {
        const res = await axios.get(
          "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products"
        );

        if (canceled) return;

        const sliced = res.data.slice(8, 16);
        setProduct(sliced);
        setLoading(false);
        localStorage.setItem(CACHE_KEY, JSON.stringify(sliced));
      } catch {
        if (!canceled) setLoading(false);
      }
    };

    fetchProducts();
    return () => (canceled = true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center my-10">
        <TextReveal
          text="READY TO WEAR"
          className="font-semibold tracking-tighter text-3xl md:text-5xl"
        />
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          /* ---------------- SKELETON ---------------- */
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200/60 bg-white/60 backdrop-blur-sm shadow-sm p-3 space-y-4 skeleton-card"
              >
                <div className="w-full h-64 rounded-xl skeleton shimmer" />
                <div className="space-y-2 px-1">
                  <div className="h-4 w-3/4 rounded skeleton shimmer" />
                  <div className="h-4 w-1/2 rounded skeleton shimmer" />
                </div>
                <div className="h-4 w-1/3 rounded skeleton shimmer" />
              </div>
            ))}
          </motion.div>
        ) : (
          /* ---------------- PRODUCTS ---------------- */
          <motion.div
            key="products"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {Products.map((p) => (
              <motion.div key={p.id} variants={itemVariants}>
                <ProductCard {...p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewArrival;
