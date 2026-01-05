import { motion } from "framer-motion";
import React from "react";
import { useCart } from "../../Context/CardContext";

const Ordersummary = () => {
  const { cart } = useCart();

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-100/80 shadow-md rounded-2xl p-6 md:p-8 h-fit space-y-6"
    >
      <h3 className="text-lg font-medium">Order Summary</h3>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id + (item.size || "")}
            className="flex gap-4 items-center"
          >
            <img
              src={item.image}
              className="w-16 h-16 rounded-xl object-cover shadow-sm"
            />
            <div className="flex-1">
              <p className="text-sm leading-tight">{item.title}</p>
              <p className="text-xs text-gray-500">
                Size: {item.size || "—"} • Qty: {item.qty}
              </p>
            </div>
            <span className="text-sm font-medium">
              ₹{item.price * item.qty}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>{shipping ? `₹${shipping}` : "Free"}</span>
        </div>

        <div className="flex justify-between text-base font-semibold pt-2">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Secure checkout • Encrypted payments
      </p>
    </motion.div>
  );
};

export default Ordersummary;
