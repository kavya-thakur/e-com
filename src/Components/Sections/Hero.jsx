import React from "react";

const Hero = () => {
  return (
    <div className="h-[80vh] mb-10 md:h-[90vh] relative z-20">
      <div className=" flex justify-center m-4 h-full">
        <div className="relative w-full h-[85vh] overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            src="./hero1.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="mt-[32rem] text-4xl md:text-6xl font-serif text-white">
          Style That Speaks Before You Do
        </h1>
      </div>
    </div>
  );
};

export default Hero;
