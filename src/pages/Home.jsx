import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  BookOpen,
  ChevronDown,
  Library,
  Feather,
} from "lucide-react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useEffect, useState } from "react";
import image1 from "../../public/images/img2.jpg";

import BookCarousel from "../components/BookCarousel";
import FeatureCard from "../components/FeatureCard";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 120,
      damping: 12
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: {
      duration: 1,
      ease: [0.6, 0.01, -0.05, 0.9]
    }
  }
};

const staggerItems = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [lang, setLang] = useState("fr");
  const [darkMode, setDarkMode] = useState(false);
  const [heroTextIndex, setHeroTextIndex] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    // Hero text animation cycle
    const heroTexts = [
      "LibraNet",
      lang === "fr" ? "Découvrez. Lisez. Grandissez." : "Discover. Read. Grow.",
      lang === "fr" ? "Votre bibliothèque intelligente" : "Your smart library"
    ];
    
    const interval = setInterval(() => {
      setHeroTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [darkMode, lang]);

  const t = {
    fr: {
      getStarted: "Commencer",
      explore: "Explorer la bibliothèque",
      books: "Collection Exclusive",
      features: "Notre Distinction",
      heroText: [
        "LibraNet",
        "Découvrez. Lisez. Grandissez.",
        "Votre bibliothèque intelligente"
      ],
      tagline: "L'excellence littéraire réinventée",
    },
    en: {
      getStarted: "Get Started",
      explore: "Explore Library",
      books: "Exclusive Collection",
      features: "Our Distinction",
      heroText: [
        "LibraNet",
        "Discover. Read. Grow.",
        "Your smart library"
      ],
      tagline: "Literary excellence reimagined",
    },
  }[lang];

  return (
    <div className="relative min-h-screen text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden isolate">
        {/* Background with subtle overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 -z-20 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-700/95"
        >
          <img
            src={image1}
            alt="Library background"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </motion.div>

        {/* Floating particles */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute inset-0 -z-10"
        >
          <Particles
            id="tsparticles"
            init={loadFull}
            options={{
              particles: {
                number: { value: 60 },
                size: { value: 2 },
                move: { 
                  enable: true, 
                  speed: 0.5,
                  direction: "none",
                  random: true,
                  straight: false,
                  out_mode: "out"
                },
                opacity: { 
                  value: 0.3,
                  random: true
                },
                color: { value: "#ffffff" }
              }
            }}
          />
        </motion.div>

        {/* Content */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 px-6 text-center max-w-4xl"
        >
          {/* Logo/Brand */}
          <motion.div variants={fadeUp} className="mb-12">
            <span className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-light tracking-wider border border-white/10 shadow-sm">
              <Feather className="w-4 h-4" />
              {lang === "fr" ? "Bibliothèque Premium" : "Premium Library"}
            </span>
          </motion.div>

          {/* Main heading with text cycling */}
          <div className="h-32 md:h-40 mb-8 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={heroTextIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="text-5xl md:text-7xl font-light tracking-tight"
              >
                <span className="text-white font-serif">
                  {t.heroText[heroTextIndex]}
                </span>
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Tagline */}
          <motion.p
            variants={fadeUp}
            className="text-xl md:text-2xl text-gray-300 mb-12 font-light max-w-2xl mx-auto tracking-wider"
          >
            {t.tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={staggerItems}
            initial="hidden"
            animate="show"
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div variants={fadeUp}>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-sm font-medium tracking-wider shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-95"
              >
                {t.getStarted}
                <Rocket className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Link
                to="/books"
                className="inline-flex items-center gap-2 bg-transparent border border-white/30 text-white hover:bg-white/5 px-8 py-4 rounded-sm font-medium tracking-wider shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-95"
              >
                {t.explore}
                <BookOpen className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-100"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 2 }}
            className="text-xs mt-2 tracking-wider"
          >
            {lang === "fr" ? "Explorez" : "Explore"}
          </motion.p>
        </motion.div>
      </section>

      {/* Book Carousel Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-wide">
              {t.books}
            </h2>
            <div className="w-24 h-px bg-gray-300 dark:bg-gray-700 mx-auto mt-6"></div>
          </motion.div>
          <BookCarousel lang={lang} t={{ books: "" }} />
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-wide">
              {t.features}
            </h2>
            <div className="w-24 h-px bg-gray-300 dark:bg-gray-700 mx-auto mt-6"></div>
          </motion.div>
          <FeatureCard />
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-gray-900 text-white border-t border-gray-800"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-12"
          >
            <Library className="w-16 h-16 mx-auto p-4 bg-white/5 rounded-full" />
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-light mb-8 tracking-wide"
          >
            {lang === "fr"
              ? "Prêt à commencer votre voyage littéraire ?"
              : "Ready to begin your literary journey?"}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 mb-12 max-w-2xl mx-auto tracking-wider leading-relaxed"
          >
            {lang === "fr"
              ? "Accédez à une collection soigneusement sélectionnée des plus grands ouvrages."
              : "Access a meticulously curated collection of the finest works."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-sm font-medium tracking-wider shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-95"
            >
              {t.getStarted}
              <Rocket className="w-5 h-5" />
            </Link>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 bg-transparent border border-white/30 text-white hover:bg-white/5 px-8 py-4 rounded-sm font-medium tracking-wider shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-95"
            >
              {t.explore}
              <BookOpen className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}