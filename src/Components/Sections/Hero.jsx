import React from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const text = "Style That Speaks Before You Do....";
  const words = text.split(" ");

  /* ----------- YOUR HEADLINE ANIMATION (UNCHANGED) ----------- */

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.4,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 15,
      filter: "blur(12px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  /* ----------- SUPPORTING TIMELINE ANIMATIONS ----------- */

  const fadeUpSoft = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const revealMask = {
    hidden: { y: "120%" },
    visible: {
      y: "0%",
      transition: {
        duration: 1.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative w-screen h-screen max-h-screen overflow-hidden">
      {/* VIDEO */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="./hero1.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center h-full px-6 text-center gap-6">
        {/* BRAND SIGNAL — TIMELINE ENTRY */}
        <motion.span
          variants={fadeUpSoft}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25 }}
          className="uppercase tracking-[0.3em] text-xs text-white/70 mt-30"
        >
          New Season · Limited Drop
        </motion.span>

        {/* HEADLINE — UNCHANGED */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="absolute max-w-[54rem] bottom-5 md:bottom-3 left-0 text-start text-[8vh] md:text-[11vh] lg:text-[14vh] font-serif text-white flex flex-wrap gap-x-[0.35em] leading-none"
        >
          {words.map((word, i) => (
            <motion.span key={i} variants={wordVariants}>
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* SUPPORTING LINE — MASKED REVEAL */}
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.4 }}
          className="absolute -right-5 max-w-[16rem] md:max-w-[30rem] top-80 md:top-50 overflow-hidden"
        >
          <motion.h6
            variants={revealMask}
            className="tracking-wider md:p-10 text-white text-md md:text-2xl text-start font-semibold"
          >
            Modern silhouettes crafted with premium fabrics for effortless
            everyday elegance.
          </motion.h6>
        </motion.div>

        {/* CTA — CALM ENTRY + UNIQUE ICON HOVER */}
        <motion.div
          variants={fadeUpSoft}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.8 }}
          className="absolute top-105 md:top-90 right-15 md:right-55"
        >
          <Link to={"/men"}>
            <button className="group px-6 py-3 backdrop-blur-sm bg-white/10 text-white text-xs md:text-sm md:tracking-wide rounded-full flex gap-2 items-center">
              <span>Explore Collection</span>

              {/* ICON MICRO-INTERACTION */}
              <motion.span
                initial={{ x: 0 }}
                whileHover={{
                  x: 8,
                  rotate: -6,
                  transition: {
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                className="inline-flex"
              >
                <MoveRight size={20} />
              </motion.span>
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
