import { useEffect, useState } from "react";
import axios from "axios";
import { Users } from "lucide-react";

export default function ListeUtilisateurs() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/utilisateurs/get-all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Erreur récupération utilisateurs :", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-100 via-white to-blue-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl p-8 mt-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6" /> Liste des utilisateurs
      </h2>

      <div className="overflow-x-auto rounded-lg border border-purple-200 dark:border-gray-700 shadow-md">
        <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-200">
          <thead className="text-xs uppercase bg-purple-100 dark:bg-gray-800 text-purple-600 dark:text-purple-300">
            <tr>
              <th scope="col" className="px-6 py-4">Nom</th>
              <th scope="col" className="px-6 py-4">Prénom</th>
              <th scope="col" className="px-6 py-4">Email</th>
              <th scope="col" className="px-6 py-4">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="odd:bg-white even:bg-purple-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700 hover:bg-purple-100 dark:hover:bg-gray-700 transition">
                  <td className="px-6 py-4">{u.nom}</td>
                  <td className="px-6 py-4">{u.prenom}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 capitalize">{u.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-6 py-6 text-gray-500 dark:text-gray-400">Aucun utilisateur trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
