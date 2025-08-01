import React from "react";
import { motion } from "framer-motion";
import {
  FaRobot,
  FaUserPlus,
  FaBookOpen,
  FaBookmark,
  FaArrowCircleLeft,
  FaCreditCard,
  FaMobileAlt,
} from "react-icons/fa";

const colors = {
  blue: "from-blue-500 to-blue-600",
  purple: "from-purple-500 to-purple-600",
  green: "from-green-500 to-green-600",
};

const userFeatures = [
  {
    icon: <FaRobot size={24} />,
    title: "Chatbot intelligent",
    description:
      "Un assistant virtuel qui guide dans la recherche de documents, répond aux questions fréquentes, et facilite les démarches (emprunt, réservation, prolongation).",
    color: "green",
  },
  {
    icon: <FaBookmark size={24} />,
    title: "Réservation de documents",
    description: "Réserver vos livres ou documents préférés en quelques clics, où que vous soyez.",
    color: "purple",
  },
  {
    icon: <FaBookOpen size={24} />,
    title: "Emprunt et consultation",
    description: "Emprunter et consulter facilement les livres et autres documents numériques.",
    color: "green",
  },
];

const FeatureCard = ({ icon, title, description, color = "blue" }) => {
  const gradient = colors[color] || colors.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
    >
      <div
        className={`w-16 h-16 mb-6 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center text-white`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

const UserFeaturesSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {userFeatures.map(({ icon, title, description, color }) => (
        <FeatureCard
          key={title}
          icon={icon}
          title={title}
          description={description}
          color={color}
        />
      ))}
    </section>
  );
};

export default UserFeaturesSection;
