import React from "react";
import Navbar from "./Components/Navbar";
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

const App = () => {
  return (
    <div className="overflow-hidden">
      <Navbar />
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

      </Routes>
    </div>
  );
};

export default App;
