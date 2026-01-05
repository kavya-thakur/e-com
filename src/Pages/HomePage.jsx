import React from "react";
import Hero from "../Components/Sections/Hero";
import NewArrival from "../Components/Sections/NewArrival";
import NewCollection from "../Components/Sections/NewCollection";
import Fashioncollection from "../Components/Sections/Fashioncollection";
import Footer from "../Components/Sections/Footer";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <NewArrival />
      <NewCollection />
      <Fashioncollection />
      <Footer />
    </div>
  );
};

export default HomePage;
