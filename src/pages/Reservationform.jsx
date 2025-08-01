import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/useContext";
import { Calendar, Clock, CreditCard, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ReservationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await api.get(`/livres/get-by-id/${id}`);
        setBook(res.data);
      } catch (err) {
        setError("Failed to load book details");
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: `/books/${id}/reserve` } });
      return;
    }
    if (!dateDebut || !dateFin) {
      setError("Please select both start and end dates");
      return;
    }
    
    setSubmitting(true);
    setError("");
    
    try {
      const res = await api.post(
        "/reservations/create",
        {
          user_id: user._id,
          livre_id: id,
          date_debut: dateDebut,
          date_fin: dateFin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = res.data.checkout_url;
    } catch (err) {
      setError(err.response?.data?.message || "Reservation failed. Please try again.");
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md text-center">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg mb-6">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!book) return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md text-center">
        <div className="bg-gray-100 dark:bg-gray-800 px-6 py-4 rounded-lg mb-6">
          Book not found
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 mb-6 hover:underline"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to book
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Book Image - Larger Section */}
            <div className="lg:w-1/2 xl:w-2/5 p-8 bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
              <div className="relative w-full h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-md">
                <img
                  src={`http://localhost:8000${book.image_url}`}
                  alt={book.titre}
                  className="absolute inset-0 w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = '/placeholder-book.jpg';
                  }}
                />
              </div>
            </div>

            {/* Reservation Form - Larger Section */}
            <div className="lg:w-1/2 xl:w-3/5 p-8 lg:p-12">
              <div className="mb-8">
                <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-white mb-2">
                  {book.titre}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 italic">
                  by {book.auteur || "Unknown author"}
                </p>
              </div>

              <div className="mb-8">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {book.description || "No description available"}
                </p>
                
                <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 px-6 py-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reservation Price</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      ${book.reservation_price?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <CreditCard className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                </div>
              </div>

              {/* Reservation Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="dateDebut" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-3" />
                        Start Date
                      </div>
                    </label>
                    <input
                      id="dateDebut"
                      type="date"
                      value={dateDebut}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDateDebut(e.target.value)}
                      className="w-full px-5 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="dateFin" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-3" />
                        End Date
                      </div>
                    </label>
                    <input
                      id="dateFin"
                      type="date"
                      value={dateFin}
                      min={dateDebut || new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDateFin(e.target.value)}
                      className="w-full px-5 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg text-lg">
                    {error}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 text-xl"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Processing Reservation...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6 mr-3" />
                      Reserve & Proceed to Payment
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}