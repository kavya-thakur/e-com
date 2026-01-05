import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "../ProductCard";

const NewCollection = () => {
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    const fetchingProducts = async () => {
      const res = await axios.get(
        "https://695116da70e1605a10893d60.mockapi.io/api/v1/products"
      );
      setProducts(res.data.slice(17, 29));
    };

    fetchingProducts();
  }, []);
  return (
    <div className="min-h-screen max-w-7xl mx-auto pt-10 md:pt-20 relative">
      <div className="flex flex-col-reverse md:flex-row gap-4 relative p-4 md:px-0">
        <img
          className="h-[70vh] w-full object-cover rounded-xl md:h-[85vh]  md:w-fit"
          src="./newcollection.png"
          alt=""
        />
        <div className="absolute px-4 md:px-5 bottom-13  md:bottom-20 text-white/70 font-light text-3xl md:text-[2.8rem] leading-none capitalize tracking-tighter">
          <h4>Premium fabrics, </h4>
          <h4>timeless silhouettes,</h4>
          <h4>effortless everyday elegance.</h4>
        </div>
        <div
          className=" text-5xl tracking-tighter font-serif
         leading-none md:text-6xl relative w-full"
        >
          <h2>NEW</h2>
          <h2>COLLECTION</h2>
          <h5 className="absolute leading-normal tracking-wide right-0 top-0 text-sm md:text-base">
            See More
          </h5>
          <img
            className="h-[45vh] hidden rounded-xl md:block md:w-fit absolute bottom-0"
            src="./newcollection2.png"
            alt=""
          />

          <div className="hidden md:block font-light md:text-base tracking-normal absolute right-0 w-88 pt-22">
            <p>
              Our newest collection is an invitation to slow down and rediscover
              the beauty of well-crafted clothing. Each piece is thoughtfully
              designed with refined silhouettes, soft textures, and details that
              feel intentional rather than loud. These garments aren’t made to
              chase trends they’re made to stay with you, season after season.
            </p>
            <p>
              From tailored layers to relaxed everyday essentials, every fabric,
              stitch, and finish has been chosen to elevate the way you move
              through the world. This is luxury expressed quietly effortless,
              timeless, and made to feel like it was created just for you.
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
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
    </div>
  );
};

export default NewCollection;
