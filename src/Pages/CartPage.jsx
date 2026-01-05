import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useCart } from "../Context/CardContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, dispatch } = useCart();

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl md:text-5xl font-semibold mb-8 tracking-tight">
        Shopping Cart
      </h1>

      {/* EMPTY */}
      {cart.length === 0 && (
        <div className="text-center py-24 border rounded-2xl bg-gray-50">
          <p className="text-gray-500 text-lg">
            Your cart is empty — start exploring products.
          </p>
        </div>
      )}

      {cart.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          {/* LEFT — CART ITEMS */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8 ">
            {cart.map((item) => (
              <motion.div
                key={item.id + (item.size || "")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-5"
              >
                <img
                  src={item.image}
                  className="w-24 h-34 md:w-34 md:h-44 rounded-xl object-cover"
                />

                <div className="flex-1 space-y-1">
                  <h2 className=" leading-tight md:text-xl">{item.title}</h2>

                  <p className="text-sm text-gray-500 capitalize ">
                    Size:{" "}
                    <span className=" text-gray-700">{item.size || "—"}</span>
                  </p>

                  <p className="text-gray-900 text-sm md:text-base">
                    ₹{item.price}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() =>
                        dispatch({ type: "DECREASE", id: item.id })
                      }
                      className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-100"
                    >
                      –
                    </button>

                    <span className="">{item.qty}</span>

                    <button
                      onClick={() => dispatch({ type: "ADD", payload: item })}
                      className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => dispatch({ type: "REMOVE", id: item.id })}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* RIGHT — SUMMARY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-gray-200/50 space-y-5 h-fit w-full"
          >
            <h2 className="text-lg font-medium">Order Summary</h2>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="">₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="">{shipping ? `₹${shipping}` : "Free"}</span>
            </div>

            <div className="border-t pt-4 flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mt-3 min-w-0">
              <input
                placeholder="Coupon code"
                className="flex-1 border border-neutral-300 rounded-xl px-3 py-2 text-sm min-w-0"
              />

              <button className="px-4 py-2 rounded-xl border text-sm  border-neutral-300 hover:bg-gray-100">
                Apply
              </button>
            </div>

            {/* Checkout */}
            <Link to={"/checkout"}>
              <button className="mt-4 w-full text-sm bg-black text-white py-3 rounded-xl hover:opacity-90">
                Proceed to Checkout
              </button>
            </Link>

            <p className="text-xs text-gray-500 text-center mt-2">
              Secure checkout • Free returns within 7 days
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
