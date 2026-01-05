import React from "react";

const Hero = () => {
  return (
    <div className="h-[85vh] md:h-[90vh] relative">
      <div className=" flex justify-center m-4 h-full">
        <img
          src="./herosection.png"
          className=" md:w-[80rem] object-cover rounded-3xl"
          alt="kay"
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h1 className="mt-40 md:mt-0 text-4xl font-serif text-neutral-600">
          Style That Speaks Before You Do
        </h1>
      </div>
    </div>
  );
};

export default Hero;
