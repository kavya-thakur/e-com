// import { useNavigate, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ArrowLeft,
//   Box,
//   RotateCcw,
//   ShieldCheck,
//   ShoppingCart,
//   Truck,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import { useCart } from "../../Context/CartContext";
// import { wait } from "../utils/wait";
// import Footer from "./Footer";
// import toast from "react-hot-toast";

// const API_URL = "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products";
// const CACHE_KEY = "product_cache";

// export default function ProductDetail() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [selectedSize, setSelectedSize] = useState("M");
//   const [adding, setAdding] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { dispatch } = useCart();

//   useEffect(() => {
//     let canceled = false;

//     async function fetchProduct() {
//       setLoading(true);

//       // 1️⃣ check cache
//       const cached = localStorage.getItem(`${CACHE_KEY}_${id}`);
//       if (cached) {
//         await wait(350);
//         setProduct(JSON.parse(cached));
//         setLoading(false);
//         return;
//       }

//       // 2️⃣ fetch from API only when needed
//       try {
//         const { data } = await axios.get(`${API_URL}/${id}`);
//         if (canceled) return;

//         setProduct(data);
//         setLoading(false);

//         // save to cache
//         localStorage.setItem(`${CACHE_KEY}_${id}`, JSON.stringify(data));
//       } catch (err) {
//         if (!canceled) setLoading(false);
//       }
//     }

//     fetchProduct();

//     // 3️⃣ cleanup
//     return () => (canceled = true);
//   }, [id]);

//   const handleAdd = () => {
//     dispatch({
//       type: "ADD",
//       payload: {
//         id: product.id,
//         title: product.title,
//         price: product.price,
//         image: product.image,
//         size: selectedSize,
//       },
//     });

//     setAdding(true);
//     toast.success("Added Successfully");
//     setTimeout(() => setAdding(false), 1200);
//   };

//   // =================== SKELETON LOADER ===================
//   if (loading)
//     return (
//       <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10 md:mt-4">
//         <div className="rounded-2xl h-[24rem] md:h-[80vh] skeleton shimmer" />

//         <div className="space-y-5">
//           <div className="h-6 w-2/3 skeleton shimmer rounded" />
//           <div className="h-4 w-32 skeleton shimmer rounded" />
//           <div className="h-5 w-20 skeleton shimmer rounded" />

//           <div className="h-20 skeleton shimmer rounded" />

//           <div className="flex gap-2">
//             {[1, 2, 3, 4].map((i) => (
//               <div
//                 key={i}
//                 className="h-10 w-20 rounded-full skeleton shimmer"
//               />
//             ))}
//           </div>

//           <div className="h-10 w-full rounded-lg skeleton shimmer" />

//           <div className="space-y-2">
//             <div className="h-4 w-40 skeleton shimmer rounded" />
//             <div className="h-4 w-3/4 skeleton shimmer rounded" />
//           </div>
//         </div>
//       </div>
//     );

//   // =================== MAIN CONTENT ===================
//   return (
//     <>
//       <div className="max-w-7xl mx-auto  px-4 py-2 ">
//         <motion.button
//           whileHover={{ x: -3 }}
//           whileTap={{ scale: 0.97 }}
//           onClick={() => navigate(-1)}
//           className=" inline-flex  w-fit items-center gap-2 px-4 py-2 rounded-full text-neutral-700 text-sm"
//         >
//           <ArrowLeft size={14} />
//           Back
//         </motion.button>
//       </div>

//       <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 mb-10">
//         {/* IMAGE */}
//         <div className="flex justify-center w-full ">
//           <motion.img
//             src={product.image}
//             alt={product.title}
//             className="h-[21rem] md:h-[80vh] rounded-xl object-cover shadow-xl"
//             initial={{ opacity: 0, y: 25 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.45 }}
//           />
//         </div>

//         {/* RIGHT CONTENT */}
//         <motion.div
//           initial={{ opacity: 0, y: 25 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.05, duration: 0.45 }}
//           className="space-y-3"
//         >
//           <h2 className=" text-lg md:text-3xl font-serif capitalize tracking-tight leading-none font-semibold">
//             {product.title}
//           </h2>

//           <p className="text-gray-600 font-medium capitalize bg-neutral-100 text-xs w-fit rounded-full px-4 py-1">
//             {product.category}
//           </p>

//           <motion.h2
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-base font-medium"
//           >
//             Rs. {product.price}
//           </motion.h2>

//           <p className="text-gray-600 text-sm md:text-base leading-relaxed ">
//             {product.description}
//           </p>

//           {/* SIZES */}
//           <div>
//             <p className="text-neutral-500 text-xs md:text-sm my-2 md:mb-3">
//               Select Size
//             </p>
//             <div className="flex gap-2">
//               {["S", "M", "L", "XL"].map((s) => (
//                 <motion.button
//                   key={s}
//                   onClick={() => setSelectedSize(s)}
//                   className={`py-2 px-4 w-full md:py-4 md:px-6 rounded-full text-sm transition
//                 ${
//                   selectedSize === s
//                     ? "bg-black text-white"
//                     : "bg-neutral-200 text-black"
//                 }`}
//                 >
//                   {s}
//                 </motion.button>
//               ))}
//             </div>
//           </div>

//           {/* ADD TO CART */}
//           <motion.button
//             whileTap={{ scale: 0.96 }}
//             onClick={handleAdd}
//             className="capitalize rounded-lg my-5 py-2 md:py-3 flex items-center justify-center gap-3 text-sm px-4 bg-black w-full text-white"
//           >
//             <ShoppingCart className="w-4" />{" "}
//             {adding ? "Added ✔" : "Add to cart"}
//           </motion.button>

//           {/* DESCRIPTION */}
//           <div>
//             <h2 className="font-medium mb-2">Description & Fit</h2>
//             <p className="text-gray-500 text-sm">{product.description}</p>
//           </div>

//           {/* SHIPPING */}
//           <div className=" mt-10  border-neutral-300">
//             <h2 className="font-medium mb-6 tracking-tight text-lg">
//               Shipping & service
//             </h2>

//             <div className="grid md:grid-cols-2 gap-6">
//               {[
//                 {
//                   icon: <Truck className="w-5 h-5 text-gray-900" />,
//                   label: "Fast delivery",
//                   des: "3–4 business days",
//                 },
//                 {
//                   icon: <Box className="w-5 h-5 text-gray-900" />,
//                   label: "Secure packaging",
//                   des: "Every order packed with care",
//                 },
//                 {
//                   icon: <RotateCcw className="w-5 h-5 text-gray-900" />,
//                   label: "Easy returns",
//                   des: "10-day hassle-free return",
//                 },
//                 {
//                   icon: <ShieldCheck className="w-5 h-5 text-gray-900" />,
//                   label: "Quality guarantee",
//                   des: "Premium materials, always",
//                 },
//               ].map((s, i) => (
//                 <motion.div
//                   key={i}
//                   initial={{ opacity: 0, y: 16 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   whileHover={{ y: -2 }}
//                   transition={{ duration: 0.35 }}
//                   className="rounded-2xl p-5 bg-gradient-to-br from-neutral-100 to-neutral-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
//                 >
//                   <div className="flex items-center gap-3 mb-2">
//                     <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center">
//                       {s.icon}
//                     </div>

//                     <h2 className="tracking-tight">{s.label}</h2>
//                   </div>

//                   <p className="text-sm text-gray-600">{s.des}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       <Footer />
//     </>
//   );
// }

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Box,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../Context/CartContext";
import { wait } from "../utils/wait";
import Footer from "./Footer";
import toast from "react-hot-toast";

const API_URL = "https://695bc5731d8041d5eeb8581b.mockapi.io/api/v1/products";
const CACHE_KEY = "product_cache";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { dispatch } = useCart();

  useEffect(() => {
    let canceled = false;
    async function fetchProduct() {
      setLoading(true);
      const cached = localStorage.getItem(`${CACHE_KEY}_${id}`);
      if (cached) {
        await wait(400);
        setProduct(JSON.parse(cached));
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`${API_URL}/${id}`);
        if (canceled) return;
        setProduct(data);
        setLoading(false);
        localStorage.setItem(`${CACHE_KEY}_${id}`, JSON.stringify(data));
      } catch (err) {
        if (!canceled) setLoading(false);
      }
    }
    fetchProduct();
    return () => (canceled = true);
  }, [id]);

  const handleAdd = () => {
    dispatch({
      type: "ADD",
      payload: { ...product, size: selectedSize },
    });
    setAdding(true);
    toast.success("Added to Bag");
    setTimeout(() => setAdding(false), 2000);
  };

  // =================== PREMIUM DARK SKELETON ===================
  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 grid md:grid-cols-2 gap-16">
        <div className="aspect-[3/4] bg-neutral-100 rounded-sm animate-pulse" />
        <div className="space-y-6">
          <div className="h-10 w-3/4 bg-neutral-100 rounded" />
          <div className="h-4 w-20 bg-neutral-50 rounded" />
          <div className="h-6 w-32 bg-neutral-100 rounded" />
          <div className="h-24 w-full bg-neutral-50 rounded" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 w-full bg-neutral-100 rounded-full"
              />
            ))}
          </div>
          <div className="h-14 w-full bg-neutral-200 rounded-full" />
        </div>
      </div>
    );

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 pb-20 font-sans text-neutral-900">
        {/* BACK BUTTON */}
        <motion.button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-12 text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </motion.button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* IMAGE SECTION */}
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="aspect-[3/4] bg-neutral-50 overflow-hidden rounded-sm"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* CONTENT SECTION */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col space-y-8"
          >
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-5xl font-light uppercase tracking-tighter leading-tight">
                {product.title}
              </h1>
              <p className="text-xl md:text-2xl font-medium tracking-tight mt-4 text-black">
                ₹{Number(product.price).toLocaleString()}
              </p>
            </div>

            <p className="text-sm md:text-base text-neutral-600 font-light leading-relaxed max-w-lg">
              {product.description}
            </p>

            {/* SIZE SELECTOR */}
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-900">
                Select Size
              </p>
              <div className="flex gap-2">
                {["S", "M", "L", "XL"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`flex-1 py-4 border text-[11px] font-bold uppercase tracking-widest transition-all rounded-full cursor-pointer
                    ${
                      selectedSize === s
                        ? "bg-black text-white border-black"
                        : "bg-transparent text-neutral-400 border-neutral-200 hover:border-black hover:text-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              onClick={handleAdd}
              disabled={adding}
              className="w-full bg-black text-white py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 cursor-pointer mt-4"
            >
              <ShoppingCart size={16} />
              {adding ? "Added to Bag" : "Add to Bag"}
            </button>

            {/* SERVICE TILES */}
            <div className="pt-12 grid grid-cols-2 gap-4">
              {[
                {
                  icon: <Truck size={18} />,
                  label: "Express Shipping",
                  des: "3-4 Days",
                },
                {
                  icon: <RotateCcw size={18} />,
                  label: "Easy Returns",
                  des: "10-Day Window",
                },
                {
                  icon: <ShieldCheck size={18} />,
                  label: "Authentic",
                  des: "100% Quality",
                },
                {
                  icon: <Box size={18} />,
                  label: "Secure Wrap",
                  des: "Premium Care",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="p-4 border border-neutral-100 rounded-sm space-y-2"
                >
                  <div className="text-black">{s.icon}</div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      {s.label}
                    </p>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-tighter">
                      {s.des}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
