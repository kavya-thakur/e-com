// import { motion } from "framer-motion";
// import React from "react";
// import { useCart } from "../../Context/CartContext";

// const Ordersummary = () => {
//   const { cart } = useCart();

//   const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
//   const shipping = subtotal > 0 ? 49 : 0;
//   const total = subtotal + shipping;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 25 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="bg-gray-100/80 shadow-md rounded-2xl p-6 md:p-8 h-fit space-y-6"
//     >
//       <h3 className="text-lg font-medium">Order Summary</h3>

//       <div className="space-y-4">
//         {cart.map((item) => (
//           <div
//             key={item.id + (item.size || "")}
//             className="flex gap-4 items-center"
//           >
//             <img
//               src={item.image}
//               className="w-16 h-16 rounded-xl object-cover shadow-sm"
//             />
//             <div className="flex-1">
//               <p className="text-sm leading-tight">{item.title}</p>
//               <p className="text-xs text-gray-500">
//                 Size: {item.size || "—"} • Qty: {item.qty}
//               </p>
//             </div>
//             <span className="text-sm font-medium">
//               ₹{item.price * item.qty}
//             </span>
//           </div>
//         ))}
//       </div>

//       <div className="pt-4 space-y-3">
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Subtotal</span>
//           <span>₹{subtotal}</span>
//         </div>

//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Shipping</span>
//           <span>{shipping ? `₹${shipping}` : "Free"}</span>
//         </div>

//         <div className="flex justify-between text-base font-semibold pt-2">
//           <span>Total</span>
//           <span>₹{total}</span>
//         </div>
//       </div>

//       <p className="text-xs text-gray-500 text-center">
//         Secure checkout • Encrypted payments
//       </p>
//     </motion.div>
//   );
// };

// export default Ordersummary;

import { motion } from "framer-motion";
import React from "react";
import { useCart } from "../../Context/CartContext";

const Ordersummary = () => {
  const { cart } = useCart();

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 1500 ? 0 : subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-neutral-100 rounded-sm p-6 md:p-8 h-fit space-y-8 sticky top-24"
    >
      <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-neutral-900 border-b border-neutral-50 pb-4">
        Order Summary
      </h3>

      {/* ITEM MINI-LIST */}
      <div className="space-y-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {cart.map((item) => (
          <div
            key={item.id + (item.size || "")}
            className="flex gap-4 items-center py-2"
          >
            <div className="relative">
              <img
                src={item.image}
                className="w-16 h-20 rounded-sm object-cover bg-neutral-50"
              />
              <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full border border-white">
                {item.qty}
              </span>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-[11px] uppercase tracking-wider font-semibold line-clamp-1">
                {item.title}
              </p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-light">
                Size: {item.size || "—"}
              </p>
            </div>
            <span className="text-[11px] font-medium">
              ₹{(item.price * item.qty).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* CALCULATIONS */}
      <div className="pt-2 space-y-4 border-t border-neutral-50">
        <div className="flex justify-between text-[11px] uppercase tracking-widest">
          <span className="text-neutral-500 font-light">Subtotal</span>
          <span className="font-medium">₹{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-[11px] uppercase tracking-widest">
          <span className="text-neutral-500 font-light">
            Estimated Shipping
          </span>
          <span className="font-medium">
            {shipping ? `₹${shipping}` : "Complimentary"}
          </span>
        </div>

        <div className="flex justify-between text-sm uppercase tracking-[0.2em] font-bold pt-4 border-t border-neutral-900">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      {/* REASSURANCE SECTION */}
      <div className="pt-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-neutral-400">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-[9px] uppercase tracking-[0.2em] font-medium italic">
            Secure Encrypted Checkout
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Ordersummary;
