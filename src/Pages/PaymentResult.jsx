import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");
  const [status, setStatus] = useState("checking");

  // Use a Ref to hold the interval ID to ensure it can be cleared from any scope
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    const checkPayment = async () => {
      try {
        const res = await fetch(
          `https://ecommerce-rx1m.onrender.com/api/checkPaymentStatus/${orderId}`,
        );

        if (!res.ok) {
          console.warn("Server response not OK, retrying...");
          return;
        }

        const data = await res.json();

        // Normalize status to lowercase
        const currentStatus = data.status?.toLowerCase();
        console.log("Current Status:", currentStatus);

        if (currentStatus === "paid" || currentStatus === "success") {
          setStatus("success");
          stopPolling();
        } else if (
          currentStatus === "failed" ||
          currentStatus === "cancelled" ||
          currentStatus === "expired" ||
          currentStatus === "user_dropped"
        ) {
          setStatus("failed");
          stopPolling();
        } else if (
          currentStatus === "checking" ||
          currentStatus === "pending_payment" ||
          currentStatus === "active"
        ) {
          setStatus("checking");
        } else {
          // Fallback for unknown statuses
          console.log("Unexpected status received, continuing poll...");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    const stopPolling = () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
        console.log("Polling stopped.");
      }
    };

    // 1. Initial check immediately
    checkPayment();

    // 2. Set the interval to the ref
    pollIntervalRef.current = setInterval(checkPayment, 4000);

    // 3. Safety Timeout: If still checking after 60 seconds, stop and show failed
    const safetyTimeout = setTimeout(() => {
      if (status === "checking") {
        console.warn("Safety timeout reached.");
        stopPolling();
        setStatus("failed");
      }
    }, 60000);

    // 4. Clean up
    return () => {
      stopPolling();
      clearTimeout(safetyTimeout);
    };
  }, [orderId, status]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-6">
      <AnimatePresence mode="wait">
        {status === "checking" && (
          <motion.div
            key="checking"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center space-y-6"
          >
            <Loader2
              className="w-12 h-12 animate-spin mx-auto text-neutral-200"
              strokeWidth={1}
            />
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-[0.3em] font-bold">
                Verifying Payment
              </h2>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
                Please do not refresh or close this window
              </p>
            </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 max-w-md"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center">
                <CheckCircle2
                  className="w-10 h-10 text-white"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-light uppercase tracking-tighter italic">
                Thank You for Your Order
              </h1>
              <p className="text-[11px] text-neutral-500 uppercase tracking-[0.2em] leading-relaxed">
                Your payment was successful. We’ve sent a confirmation email to
                your registered address.
              </p>
            </div>
            <div className="pt-4 space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400">
                Order ID: #{orderId}
              </p>
              <Link
                to="/"
                className="inline-block bg-black text-white text-[10px] uppercase tracking-[0.3em] px-10 py-4 rounded-full hover:bg-neutral-800 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 max-w-md"
          >
            <div className="flex justify-center">
              <XCircle className="w-20 h-20 text-red-500" strokeWidth={1} />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-light uppercase tracking-tighter">
                Payment Failed
              </h1>
              <p className="text-[11px] text-neutral-500 uppercase tracking-[0.2em] leading-relaxed">
                Something went wrong during the transaction. Your bank account
                has not been charged, or a refund will be initiated.
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <Link
                to="/cart"
                className="bg-black text-white text-[10px] uppercase tracking-[0.3em] px-10 py-4 rounded-full"
              >
                Return to Cart
              </Link>
              <Link
                to="/"
                className="text-[10px] uppercase tracking-widest text-neutral-400 underline underline-offset-4"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
