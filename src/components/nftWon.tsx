import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import easyImg from "../assets/easy.png";
import normalImg from "../assets/normal.png";
import hardImg from "../assets/hard.png";

const difficultyImages: Record<string, string> = {
  easy: easyImg,
  medium: normalImg,
  hard: hardImg,
};

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500",
  medium: "bg-yellow-500",
  hard: "bg-red-500",
};

const NFTWon = ({ difficulty }: { difficulty: "easy" | "medium" | "hard" | "" }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // If difficulty is empty, don't render the component
  if (!difficulty || !(difficulty in difficultyImages)) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      {showConfetti && <Confetti numberOfPieces={300} recycle={false} />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`p-8 rounded-2xl shadow-2xl text-white text-center relative ${difficultyColors[difficulty]}`}
      >
        <h2 className="text-3xl font-bold mb-4">Congratulations! 🎉</h2>
        <p className="text-lg mb-4">You won the {difficulty.toUpperCase()} NFT!</p>
        
        <motion.img
          src={difficultyImages[difficulty]}
          alt={`${difficulty} NFT`}
          className="w-[24rem] h-[24rem] mx-auto rounded-xl shadow-lg"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        <motion.button
          className="mt-6 px-6 py-2 text-lg font-bold rounded-full bg-white text-black shadow-lg hover:scale-105 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()} // Close screen on click
        >
          Close
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NFTWon;
