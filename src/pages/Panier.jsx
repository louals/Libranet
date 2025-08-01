import { useEffect, useState } from "react";
import { Trash2, BookOpenCheck, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function Panier() {
  const [panier, setPanier] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("panier")) || [];
    setPanier(stored);
  }, []);

  const viderPanier = () => {
    localStorage.removeItem("panier");
    setPanier([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-10 flex items-center justify-center gap-2">
        <ShoppingCart className="w-6 h-6" />
        Mon Panier
      </h2>

      {panier.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
          🛒 Votre panier est vide.
        </p>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {panier.map((livre, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-3"
              >
                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {livre.titre}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">✍️ {livre.auteur}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                  {livre.description}
                </p>
                {livre.image && (
                  <img
                    src={livre.image}
                    alt={livre.titre}
                    className="w-full h-40 object-cover rounded"
                  />
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={viderPanier}
              className="bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" /> Vider le panier
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}
