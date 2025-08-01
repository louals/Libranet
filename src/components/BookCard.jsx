import { motion } from "framer-motion";
import { Star, Bookmark, BookOpen, Download } from "lucide-react";

const BookCard = ({
  id,
  titre,
  auteur,
  description,
  image_url,
  purchase_price,
  reservation_price,
  stock,
  classification,
  tags = [],
}) => {
  console.log("Tags prop:", tags);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        y: -10,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Book Image */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden group">
        <motion.img
          src={`http://localhost:8000${image_url}`}
          alt={titre}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />

        {/* Overlay with title and author */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end">
          <motion.h4
            className="text-white font-bold text-lg mb-1"
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {titre}
          </motion.h4>
          <motion.p
            className="text-white/90 text-sm"
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {auteur}
          </motion.p>
        </div>

        {/* Stock badge */}
        {stock > 0 && (
          <motion.div
            className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <span className="text-xs font-semibold text-white">{stock} en stock</span>
          </motion.div>
        )}

       
      </div>

      {/* Card footer */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {titre}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.length > 0 ? (
            tags.map((tag, idx) => (
              <motion.span
                key={idx}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.1 * idx }}
                className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"
              >
                {tag}
              </motion.span>
            ))
          ) : (
            <span className="text-gray-400 italic text-xs">Pas de tags disponibles</span>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">${reservation_price}</span>
            {reservation_price && (
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                
              </span>
            )}
          </div>
          
        </div>

        
      </div>
    </motion.div>
  );
};

export default BookCard;
