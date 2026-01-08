import React from "react";
import Hero from "../Components/Sections/Hero";
import NewArrival from "../Components/Sections/NewArrival";
import NewCollection from "../Components/Sections/NewCollection";
import Fashioncollection from "../Components/Sections/Fashioncollection";
import Footer from "../Components/Sections/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [location]);

  return (
    <div>
      <Hero />

      <section id="readytowear">
        <NewArrival />
      </section>

      <section id="new-collection">
        <NewCollection />
      </section>

      <section id="fashion-collection">
        <Fashioncollection />
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
