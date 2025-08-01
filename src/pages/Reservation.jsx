import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/useContext";

export default function ReservationsPage() {
  const { user, token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [resvRes, booksRes] = await Promise.all([
          api.get("/reservations/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/livres/get-all"),
        ]);

        setReservations(resvRes.data);
        setBooks(booksRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch reservations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]);

  const getBookTitle = (livre_id) => {
    const found = books.find((b) => b.id === livre_id);
    return found ? found.titre : "Unknown Book";
  };

  if (!user) return <div className="text-center mt-20 text-gray-500">Please log in to view your reservations.</div>;
  if (loading) return <div className="text-center mt-20 text-gray-500">Loading your reservations...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (reservations.length === 0) return <div className="text-center mt-20 text-gray-500">You have no reservations yet.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-8">
        My Reservations
      </h1>

      <div className="space-y-6">
        {reservations.map((resv) => (
          <div
            key={resv._id}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-5 transition hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {getBookTitle(resv.livre_id)}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  From: <span className="font-medium">{resv.date_debut}</span> → To:{" "}
                  <span className="font-medium">{resv.date_fin}</span>
                </p>
              </div>

              <div className="mt-2 md:mt-0">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    resv.status === "success"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {resv.status === "success" ? "Confirmed" : resv.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
