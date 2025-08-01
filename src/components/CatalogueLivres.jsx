import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen } from "lucide-react";

export default function CatalogueLivres() {
  const [livres, setLivres] = useState([]);

  useEffect(() => {
    const fetchLivres = async () => {
      try {
        const res = await axios.get("http://localhost:8000/livres/get-all");
        setLivres(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des livres :", err);
      }
    };

    fetchLivres();
  }, []);

  return (
    <section className="px-6 py-12 bg-white dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8 flex items-center gap-2">
        <BookOpen className="w-6 h-6" />
        Catalogue des livres
      </h2>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
        {livres.map((livre) => (
          <div
            key={livre.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden flex flex-col"
          >
            {/* 📸 Affichage de l’image */}
            <img
              src={livre.image_url}
              alt={livre.titre}
              className="w-full h-48 object-cover"
            />

            <div className="p-4 flex flex-col gap-1">
              <h3 className="text-lg font-bold text-blue-600">{livre.titre}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">✍️ {livre.auteur}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{livre.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
