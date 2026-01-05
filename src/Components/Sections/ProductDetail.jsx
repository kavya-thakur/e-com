import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Disc, Package2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../../Context/CardContext";

const API_URL = "https://695116da70e1605a10893d60.mockapi.io/api/v1/products";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [adding, setAdding] = useState(false);
  const { dispatch } = useCart();
  const sizes = ["S", "M", "L", "XL"];

  const shippingDets = [
    { icon: <Disc />, label: "Discount", des: "Disc 50%" },
    { icon: <Package2 />, label: "Package", des: "Regular package" },
    { icon: <Calendar />, label: "Delivery time", des: "3–4 working days" },
  ];

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data } = await axios.get(`${API_URL}/${id}`);
        setProduct(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProduct();
  }, [id]);

  if (!product) return <p className="p-10 text-center">Loading…</p>;

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
  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10 md:mt-4">
      {/* IMAGE */}
      <div className="flex justify-center w-full">
        <motion.img
          src={product.image}
          alt={product.title}
          className="h-[24rem] md:h-[80vh] rounded-2xl object-cover shadow-xl "
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
        <div className="">
          <p className="text-neutral-700 text-sm mb-3">Select Size</p>
          <div className="flex gap-2">
            {sizes.map((s) => (
              <motion.button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`py-3 px-8 rounded-full  text-sm transition duration-150
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
          className="capitalize rounded-lg my-5 py-3 flex items-center justify-center  gap-3 text-sm px-4 bg-black w-full text-white"
        >
          <ShoppingCart className="w-4" /> {adding ? "Added ✔" : "Add to cart"}
        </motion.button>

        {/* DESCRIPTION BLOCK */}
        <div>
          <h2 className="font-medium mb-2">Description & Fit</h2>
          <p className="text-gray-500 text-sm">
            Loose-fit, soft brushed interior, ribbed cuffs and hem.
          </p>
        </div>

        {/* SHIPPING */}
        <div className="capitalize">
          <h2 className="font-medium mb-3">Shipping</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {shippingDets.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="p-4 rounded-xl border shadow-sm bg-white"
              >
                <div className="mb-2">{s.icon}</div>
                <h2 className="font-medium">{s.label}</h2>
                <p className="text-sm text-gray-500">{s.des}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
