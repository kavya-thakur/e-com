import React from "react";

const Fashioncollection = () => {
  return (
    <div className="min-h-[20vh] max-w-7xl mx-auto relative py-10 px-4">
      <div className="relative">
        <video
          playsInline
          muted
          loop
          autoPlay
          src="./fashionsection.mp4"
          className="rounded-3xl"
        ></video>
        <div className="absolute px-4 md:px-10 bottom-8  md:bottom-55 text-white/50 font-light text-xl md:text-6xl leading-none capitalize tracking-tighter ">
          <h4>Designed with intention, </h4>
          <h4>tailored with precision,</h4>
          <h4>created to be worn and remembered.</h4>
          <h2 className="left-0 mt-8 font-mono text-xs md:text-2xl tracking-normal">
            NEW SEASON / EDITORIAL / COLLECTION 2025
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Fashioncollection;
