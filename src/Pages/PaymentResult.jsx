import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    let pollInterval;

    const checkPayment = async () => {
      try {
        const res = await fetch(
          `https://ecommerce-rx1m.onrender.com/api/checkPaymentStatus/${orderId}`,
        );

        // If server is down, don't spin forever
        if (!res.ok) throw new Error("Server not responding");

        const data = await res.json();

        // Normalize status to lowercase to avoid "PAID" vs "paid" bugs
        const currentStatus = data.status?.toLowerCase();

        if (currentStatus === "paid" || currentStatus === "success") {
          setStatus("success");
          if (pollInterval) clearInterval(pollInterval);
        } else if (
          currentStatus === "failed" ||
          currentStatus === "cancelled" ||
          currentStatus === "expired" ||
          currentStatus === "user_dropped"
        ) {
          setStatus("failed");
          if (pollInterval) clearInterval(pollInterval);
        } else if (
          currentStatus === "checking" ||
          currentStatus === "pending_payment"
        ) {
          setStatus("checking"); // Continue the loop
        } else {
          // Safety: If we get an unknown status, stop after a few tries
          // or treat as failed to prevent infinite loading
          console.log("Unknown status received:", currentStatus);
        }
      } catch (err) {
        console.error("Polling error:", err);
        // We don't clear interval here so it can try again in 4 seconds
      }
    };

    // 1. Run immediately
    checkPayment();

    // 2. Set the interval to the variable we defined
    pollInterval = setInterval(checkPayment, 4000);

    // 3. Clean up when the user leaves the page
    return () => clearInterval(pollInterval);
  }, [orderId]);

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
