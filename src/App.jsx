import React from "react";
import HomePage from "./Pages/HomePage";
import { Route, Routes } from "react-router-dom";
import WomensPage from "./Pages/WomensPage";
import MensPage from "./Pages/MensPage";
import ProductDetail from "./Components/Sections/ProductDetail";
import Cart from "./Pages/CartPage";
import Checkout from "./Pages/Checkout";
import PrivateRoute from "./Components/AuthPage/PrivateRoute";
import Login from "./Components/AuthPage/Login";
import Register from "./Components/AuthPage/Register";
import PaymentResult from "./Pages/PaymentResult";
import Account from "./Pages/Account";
import Orders from "./Components/Sections/Orders";
import ScrollToTop from "./ScrollToTop";
import Navbar from "./Components/smallComponents/Navbar";
import AdminOnly from "./Components/Dashboard/Adminonly";
import Dashboard from "./Components/Dashboard/Dashboard";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <div className="overflow-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "14px",
            background: "#111",
            color: "#fff",
          },
        }}
      />
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/women" element={<WomensPage />} />
        <Route path="/men" element={<MensPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment-result" element={<PaymentResult />} />

        <Route path="/account" element={<Account />} />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <PrivateRoute>
              <AdminOnly>
                <Dashboard />
              </AdminOnly>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
