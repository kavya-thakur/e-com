// import React from "react";

// const Hero = () => {
//   return (
//     <div className="h-[80vh] mb-2 md:h-[90vh] relative z-20">
//       <div className=" flex justify-center m-4 h-full">
//         <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">
//           <video
//             className="absolute inset-0 w-full h-full object-cover rounded-2xl"
//             src="./hero1.mp4"
//             autoPlay
//             muted
//             loop
//             playsInline
//           />
//         </div>
//       </div>
//       <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
//         <h1 className="mt-[32rem] text-4xl md:text-6xl font-serif text-white">
//           Style That Speaks Before You Do
//         </h1>
//       </div>
//     </div>
//   );
// };

// export default Hero;

import React from "react";
import { motion } from "framer-motion";

const textReveal = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: "easeInOut",
    },
  },
};

const Hero = () => {
  return (
    <div className="h-[80vh] mb-2 md:h-[90vh] relative z-20">
      <div className="flex justify-center m-4 h-full">
        <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            src="./hero1.mp4"
            autoPlay
            muted
            loop
            playsInline
          />

          {/* Optional subtle dark overlay for luxury feel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-black rounded-2xl"
          />
        </div>
      </div>

      {/* TEXT */}
      <div className="absolute inset-0 flex flex-col  items-center justify-center text-center px-6">
        <div className="overflow-hidden ">
          <motion.h1
            variants={textReveal}
            initial="hidden"
            animate="visible"
            className="mt-[32rem] overflow-hidden md:py-10 lg:py-5 text-4xl md:text-6xl font-serif text-white"
          >
            Style That Speaks Before You Do
          </motion.h1>
        </div>
      </div>
    </div>
  );
};

export default Hero;
