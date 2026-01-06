import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Box,
  Calendar,
  Disc,
  Package2,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../../Context/CardContext";
import { wait } from "../utils/wait";
import Footer from "./Footer";

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
  const sizes = ["S", "M", "L", "XL"];

  const shippingDets = [
    { icon: <Disc />, label: "Discount", des: "Disc 50%" },
    { icon: <Package2 />, label: "Package", des: "Regular package" },
    { icon: <Calendar />, label: "Delivery time", des: "3–4 working days" },
  ];

  useEffect(() => {
    let canceled = false;

    async function fetchProduct() {
      setLoading(true);

      // 1️⃣ check cache
      const cached = localStorage.getItem(`${CACHE_KEY}_${id}`);
      if (cached) {
        await wait(350);
        setProduct(JSON.parse(cached));
        setLoading(false);
        return;
      }

      // 2️⃣ fetch from API only when needed
      try {
        const { data } = await axios.get(`${API_URL}/${id}`);
        if (canceled) return;

        setProduct(data);
        setLoading(false);

        // save to cache
        localStorage.setItem(`${CACHE_KEY}_${id}`, JSON.stringify(data));
      } catch (err) {
        if (!canceled) setLoading(false);
      }
    }

    fetchProduct();

    // 3️⃣ cleanup
    return () => (canceled = true);
  }, [id]);

  const handleAdd = () => {
    dispatch({
      type: "ADD",
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        size: selectedSize,
      },
    });

    setAdding(true);
    setTimeout(() => setAdding(false), 1200);
  };

  // =================== SKELETON LOADER ===================
  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10 md:mt-4">
        <div className="rounded-2xl h-[24rem] md:h-[80vh] skeleton shimmer" />

        <div className="space-y-5">
          <div className="h-6 w-2/3 skeleton shimmer rounded" />
          <div className="h-4 w-32 skeleton shimmer rounded" />
          <div className="h-5 w-20 skeleton shimmer rounded" />

          <div className="h-20 skeleton shimmer rounded" />

          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 w-20 rounded-full skeleton shimmer"
              />
            ))}
          </div>

          <div className="h-10 w-full rounded-lg skeleton shimmer" />

          <div className="space-y-2">
            <div className="h-4 w-40 skeleton shimmer rounded" />
            <div className="h-4 w-3/4 skeleton shimmer rounded" />
          </div>
        </div>
      </div>
    );

  // =================== MAIN CONTENT ===================
  return (
    <>
      <div className="max-w-7xl mx-auto  px-4 py-2 ">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          className=" inline-flex  w-fit items-center gap-2 px-4 py-2 rounded-full text-neutral-700 text-sm"
        >
          <ArrowLeft size={14} />
          Back
        </motion.button>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 mb-10">
        {/* IMAGE */}
        <div className="flex justify-center w-full ">
          <motion.img
            src={product.image}
            alt={product.title}
            className="h-[24rem] md:h-[80vh] rounded-xl object-cover shadow-xl"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          />
        </div>

        {/* RIGHT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45 }}
          className="space-y-3"
        >
          <h2 className=" text-xl md:text-3xl font-serif capitalize tracking-tight leading-none font-semibold">
            {product.title}
          </h2>

          <p className="text-gray-600 font-medium capitalize bg-neutral-100 text-xs w-fit rounded-full px-4 py-1">
            {product.category}
          </p>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base font-medium"
          >
            Rs. {product.price}
          </motion.h2>

          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-10">
            {product.description}
          </p>

          {/* SIZES */}
          <div>
            <p className="text-neutral-700 text-sm mb-3">Select Size</p>
            <div className="flex gap-2">
              {["S", "M", "L", "XL"].map((s) => (
                <motion.button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-3 px-8 rounded-full text-sm transition
                ${
                  selectedSize === s
                    ? "bg-black text-white"
                    : "bg-neutral-200 text-black"
                }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ADD TO CART */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleAdd}
            className="capitalize rounded-lg my-5 py-3 flex items-center justify-center gap-3 text-sm px-4 bg-black w-full text-white"
          >
            <ShoppingCart className="w-4" />{" "}
            {adding ? "Added ✔" : "Add to cart"}
          </motion.button>

          {/* DESCRIPTION */}
          <div>
            <h2 className="font-medium mb-2">Description & Fit</h2>
            <p className="text-gray-500 text-sm">
              Loose-fit, soft brushed interior, ribbed cuffs and hem.
            </p>
          </div>

          {/* SHIPPING */}
          <div className="">
            <h2 className="font-medium mb-6 tracking-tight text-lg">
              Shipping & service
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Truck className="w-5 h-5 text-gray-900" />,
                  label: "Fast delivery",
                  des: "3–4 business days",
                },
                {
                  icon: <Box className="w-5 h-5 text-gray-900" />,
                  label: "Secure packaging",
                  des: "Every order packed with care",
                },
                {
                  icon: <RotateCcw className="w-5 h-5 text-gray-900" />,
                  label: "Easy returns",
                  des: "10-day hassle-free return",
                },
                {
                  icon: <ShieldCheck className="w-5 h-5 text-gray-900" />,
                  label: "Quality guarantee",
                  des: "Premium materials, always",
                },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-2xl p-5 bg-gradient-to-br from-neutral-100 to-neutral-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      {s.icon}
                    </div>

                    <h2 className="tracking-tight">{s.label}</h2>
                  </div>

                  <p className="text-sm text-gray-600">{s.des}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}
