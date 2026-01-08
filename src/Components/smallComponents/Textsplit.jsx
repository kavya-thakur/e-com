import { motion } from "framer-motion";

export default function TextReveal({ text, className }) {
  const words = text.split(" ");

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.03 },
          },
        }}
        className="flex flex-wrap gap-4"
      >
        {words.map((word, i) => (
          <motion.h3
            key={i}
            className="inline-block overflow-hidden"
            variants={{
              hidden: { y: "120%", opacity: 0 },
              visible: {
                y: "0%",
                opacity: 1,
                transition: {
                  duration: 0.7,
                  ease: [0.22, 0.61, 0.36, 1],
                },
              },
            }}
          >
            {word}
          </motion.h3>
        ))}
      </motion.div>
    </div>
  );
}
