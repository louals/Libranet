import { BookOpen, Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";

// Animation helpers
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Footer({ lang = "fr" }) {
  // Memoize the year so the component isn’t recalculated every render
  const year = useMemo(() => new Date().getFullYear(), []);

  const t = {
    fr: {
      nav: "Navigation",
      contact: "Contact",
      email: "Courriel",
      phone: "Téléphone",
      rights: "Tous droits réservés.",
      home: "Accueil",
      books: "Livres",
      cart: "Panier",
      login: "Connexion",
      register: "Inscription",
      tagline: "Votre bibliothèque numérique intelligente.",
    },
    en: {
      nav: "Navigation",
      contact: "Contact",
      email: "Email",
      phone: "Phone",
      rights: "All rights reserved.",
      home: "Home",
      books: "Books",
      cart: "Cart",
      login: "Login",
      register: "Register",
      tagline: "Your smart digital library.",
    },
  }[lang];

  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative w-full bg-gray-50 dark:bg-gray-950 pt-16 pb-12 text-sm text-gray-700 dark:text-gray-300 mt-24 overflow-hidden"
    >
      {/* Decorative circle */}
      <span className="absolute left-1/2 -translate-x-1/2 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        variants={containerVariants}
        className="max-w-7xl mx-auto px-6 grid gap-12 sm:grid-cols-2 md:grid-cols-4"
      >
        {/* Brand */}
        <motion.div variants={itemVariants} className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 text-xl hover:brightness-110 transition"
          >
            <BookOpen className="w-6 h-6" />
            LibraNet
          </Link>
          <p className="max-w-xs leading-relaxed text-gray-600 dark:text-gray-400">
            {t.tagline}
          </p>
          {/* Socials */}
          <div className="flex gap-4 pt-2">
            {[
              {
                href: "https://github.com/your-org",
                label: "GitHub",
                Icon: Github,
              },
              {
                href: "https://linkedin.com/company/your-org",
                label: "LinkedIn",
                Icon: Linkedin,
              },
              {
                href: "https://x.com/your-org",
                label: "Twitter/X",
                Icon: Twitter,
              },
            ].map(({ href, label, Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.15, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Nav links */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h4 className="font-semibold tracking-wide text-gray-800 dark:text-gray-100">
            {t.nav}
          </h4>
          <ul className="space-y-1">
            {[
              { to: "/", label: t.home },
              { to: "/books", label: t.books },
              { to: "/cart", label: t.cart },
              { to: "/login", label: t.login },
              { to: "/register", label: t.register },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="relative inline-block after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left after:transition-transform"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h4 className="font-semibold tracking-wide text-gray-800 dark:text-gray-100">
            {t.contact}
          </h4>
          <p>
            {t.email}:{" "}
            <a href="mailto:contact@libranet.ca" className="hover:underline">
              contact@libranet.ca
            </a>
          </p>
          <p>
            {t.phone}:{" "}
            <a href="tel:+15141234567" className="hover:underline">
              +1 514 123 4567
            </a>
          </p>
        </motion.div>

        {/* Newsletter (fresh addition) */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h4 className="font-semibold tracking-wide text-gray-800 dark:text-gray-100">
            Newsletter
          </h4>
          <p>
            {lang === "fr"
              ? "Restez à jour avec nos nouveautés et offres exclusives."
              : "Stay updated with our latest releases and exclusive deals."}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex items-center gap-2"
          >
            <input
              type="email"
              required
              placeholder="Email"
              className="flex-1 rounded-md px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              {lang === "fr" ? "S'inscrire" : "Join"}
            </button>
          </form>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        variants={itemVariants}
        className="text-center mt-12 border-t border-gray-200 dark:border-gray-800 pt-6"
      >
        © {year} LibraNet — {t.rights}
      </motion.div>
    </motion.footer>
  );
}
