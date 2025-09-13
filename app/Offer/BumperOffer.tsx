"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function BumperOffer() {
  const [show, setShow] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showFireworks, setShowFireworks] = useState(false);
  const router = useRouter();

  useEffect(() => {
  const seenTimestamp = localStorage.getItem("bumperOfferSeenAt");

  if (!seenTimestamp) {
    // Never seen before → show banner
    setShow(true);
    setTimeout(() => setShowFireworks(true), 500);
  } else {
    const lastSeen = new Date(seenTimestamp).getTime();
    const now = Date.now();

    // 2 hours = 2 * 60 * 60 * 1000 ms
    if (now - lastSeen >= 2 * 60 * 60 * 1000) {
      setShow(true);
      setTimeout(() => setShowFireworks(true), 500);
    }
  }

  const updateWindowSize = () => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  };

  updateWindowSize();
  window.addEventListener("resize", updateWindowSize);
  return () => window.removeEventListener("resize", updateWindowSize);
}, []);

const handleExplore = () => {
  // Store timestamp instead of boolean
  localStorage.setItem("bumperOfferSeenAt", new Date().toISOString());
  setShow(false);
  router.push("/");
};

  const PartyPopper = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
      className="absolute text-2xl md:text-4xl"
      initial={{ scale: 0, rotate: 0 }}
      animate={{
        scale: [0, 1.2],
        rotate: [0, 360],
        y: [0, -15, 0],
      }}
      transition={{
        duration: 1,
        delay,
        repeat: Infinity,
        repeatDelay: 3,
        ease: "easeInOut",
        type: "tween",
      }}
    >
      🎉
    </motion.div>
  );

  interface FloatingEmojiProps {
    emoji: string;
    initialX: number;
    initialY: number;
    delay?: number;
  }

  const FloatingEmoji = ({ emoji, initialX, initialY, delay = 0 }: FloatingEmojiProps) => (
    <motion.div
      className="absolute text-xl md:text-2xl pointer-events-none"
      style={{ left: `${initialX}%`, top: `${initialY}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1.2, 0],
        y: [-20, -40, -60, -80],
        x: [0, Math.random() * 40 - 20],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 2 + Math.random() * 2,
        ease: "easeOut",
        type: "tween",
      }}
    >
      {emoji}
    </motion.div>
  );

  return (
    <AnimatePresence>
      {show && (
        <>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={250}
            recycle
            colors={["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57"]}
            gravity={0.1}
          />

          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-purple-900/80 via-pink-900/80 to-orange-900/80 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Floating Emojis */}
            <FloatingEmoji emoji="🎊" initialX={10} initialY={20} delay={0} />
            <FloatingEmoji emoji="🎉" initialX={85} initialY={15} delay={0.5} />
            <FloatingEmoji emoji="✨" initialX={15} initialY={70} delay={1} />
            <FloatingEmoji emoji="🎈" initialX={80} initialY={75} delay={1.5} />
            <FloatingEmoji emoji="🎁" initialX={5} initialY={50} delay={2} />
            <FloatingEmoji emoji="💎" initialX={90} initialY={45} delay={2.5} />

            {/* Main Modal */}
            <motion.div
              className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100 rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-lg text-center relative overflow-hidden border-4 border-yellow-400"
              initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: -180 }}
              transition={{
                type: "tween",
                duration: 0.8,
                ease: "easeOut",
              }}
            >
              {/* Background Gradient Animation */}
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400"
                  animate={{
                    background: [
                      "linear-gradient(45deg, #fbbf24, #f59e0b)",
                      "linear-gradient(135deg, #f59e0b, #fbbf24)",
                      "linear-gradient(225deg, #fbbf24, #f59e0b)",
                      "linear-gradient(315deg, #f59e0b, #fbbf24)",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Party Poppers */}
              <PartyPopper delay={0} />
              <div className="absolute top-4 right-4">
                <PartyPopper delay={0.3} />
              </div>
              <div className="absolute top-4 left-4">
                <PartyPopper delay={0.6} />
              </div>

              {/* Title */}
              <motion.h1
                className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 mb-4 relative z-10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  type: "tween",
                }}
              >
                🎉 Mega Bumper Offer 🎉
              </motion.h1>

              {/* Image with Bounce */}
              <motion.div
                className="relative w-full max-w-xs md:max-w-sm mx-auto mb-4"
                initial={{ y: 80, opacity: 0, scale: 0.8 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  scale: [0.8, 1.05, 1],
                }}
                transition={{
                  delay: 0.3,
                  duration: 0.9,
                  ease: "easeOut",
                  type: "tween", // ✅ FIXED
                }}
              >
                <Image
                  src="https://i.postimg.cc/htH41dZ6/Chat-GPT-Image-Aug-28-2025-09-22-00-AM.png"
                  alt="Special Offer Jewelry"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-2xl shadow-2xl border-4 border-yellow-300"
                />
                {/* Sparkles */}
                <motion.div
                  className="absolute -top-2 -right-2 text-yellow-400 text-2xl"
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -left-2 text-orange-400 text-2xl"
                  animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  💫
                </motion.div>
              </motion.div>

              {/* Description */}
              <motion.p
                className="text-gray-700 text-base md:text-lg mb-6 font-medium leading-relaxed relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Get exciting discounts on our latest jewellery collection.
                <span className="text-orange-600 font-bold"> Limited time only!</span>
              </motion.p>

              {/* Button */}
              <motion.button
                onClick={handleExplore}
                className="relative bg-gradient-to-r from-red-500 via-pink-500 to-red-500 hover:from-red-600 hover:via-pink-600 hover:to-red-600 text-white font-bold py-3 px-8 md:py-4 md:px-12 rounded-full shadow-2xl transition-all duration-300 text-base md:text-lg uppercase tracking-wider overflow-hidden group"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(239, 68, 68, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.7,
                  duration: 0.8,
                  ease: "easeOut",
                  type: "tween",
                }}
              >
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                Explore Now 🚀
              </motion.button>

              {/* Fireworks */}
              {showFireworks && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      style={{
                        left: "50%",
                        top: "30%",
                      }}
                      animate={{
                        x: [0, Math.cos((i * 45 * Math.PI) / 180) * 100],
                        y: [0, Math.sin((i * 45 * Math.PI) / 180) * 100],
                        opacity: [1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.1 * i,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeOut",
                        type: "tween",
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
