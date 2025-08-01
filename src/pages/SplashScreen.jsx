import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
        >
          {/* Animated Background Elements */}
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-blue-200/30"
                initial={{
                  scale: 0,
                  opacity: 0,
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                  width: Math.random() * 200 + 100,
                  height: Math.random() * 200 + 100,
                }}
                animate={{
                  scale: 1,
                  opacity: 0.3,
                  transition: {
                    delay: i * 0.1,
                    duration: 1.5,
                    type: "spring",
                    damping: 4
                  }
                }}
              />
            ))}
          </motion.div>

          {/* Main Logo Animation */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            <motion.div
              initial={{ 
                scale: 0,
                rotate: -180,
                opacity: 0
              }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: 0,
                opacity: 1,
                transition: {
                  duration: 1.2,
                  ease: [0.175, 0.885, 0.32, 1.275]
                }
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
                transition: { duration: 0.6 }
              }}
            >
              <BookOpen 
                size={80} 
                className="text-indigo-600 drop-shadow-lg" 
                strokeWidth={1.8}
              />
            </motion.div>

            {/* Subtle Text Animation */}
            <motion.p
              className="mt-6 text-indigo-900/80 font-medium tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  delay: 1,
                  duration: 0.8
                }
              }}
              exit={{ 
                opacity: 0,
                transition: { duration: 0.3 }
              }}
            >
              Loading Knowledge...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}