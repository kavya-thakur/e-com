import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../ProductCard";
const NewArrival = () => {
  const [Products, setProduct] = useState([]);
  useEffect(() => {
    const fetchingProducts = async () => {
      const res = await axios.get(
        "https://695116da70e1605a10893d60.mockapi.io/api/v1/products"
      );
      console.log(res.data);
      setProduct(res.data.slice(8, 16));
    };

    fetchingProducts();
  }, []);
  return (
    <div className="max-w-7xl  mx-auto px-4 py-10">
      <div className="flex justify-between items-center my-10">
        <h3 className="font-semibold tracking-tighter leading-none text-3xl md:text-5xl ">
          READY TO WEAR
        </h3>
        <h5 className="font-light underline">SEE MORE</h5>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Products.map((p) => (
          <ProductCard
            id={p.id}
            title={p.title}
            category={p.category}
            price={p.price}
            image={p.image}
            rating={p.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default NewArrival;
