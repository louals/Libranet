import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Pencil, 
  Trash2, 
  Book, 
  Search, 
  PlusCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ListeLivres() {
  const [livres, setLivres] = useState([]);
  const [filteredLivres, setFilteredLivres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 3 columns x 3 rows
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLivres = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/livres/get-all");
        setLivres(response.data);
        setFilteredLivres(response.data);
      } catch (err) {
        console.error("Erreur chargement livres:", err);
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchLivres();
  }, []);

  useEffect(() => {
    const results = livres.filter(livre =>
      livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livre.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livre.genre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLivres(results);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, livres]);

  const supprimerLivre = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) return;

    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:8000/livres/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLivres(livres.filter((livre) => livre.id !== id));
      toast.success("Book deleted successfully");
    } catch (err) {
      console.error("Erreur suppression:", err);
      toast.error("Failed to delete book");
    } finally {
      setDeletingId(null);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLivres.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLivres.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with search and add button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <Book className="text-blue-600 dark:text-blue-400" /> 
            Book Inventory
            <span className="text-sm font-normal bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
              {filteredLivres.length} books
            </span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => navigate("/admin/add-book")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <PlusCircle size={18} />
              <span>Add Book</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredLivres.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {searchTerm ? "No matching books found" : "No books available"}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm 
                ? "Try adjusting your search query"
                : "Add a new book to get started"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate("/admin/add-book")}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Book
              </button>
            )}
          </div>
        )}

        {/* Book grid */}
        {!loading && currentItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((livre) => (
                <div
                  key={livre.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={
                        livre.image_url.startsWith("http")
                          ? livre.image_url
                          : `http://localhost:8000${livre.image_url}`
                      }
                      alt={livre.titre}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                    {livre.genre && (
                      <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {livre.genre}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">
                      {livre.titre}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {livre.auteur}
                    </p>
                    {livre.annee_publication && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Published: {livre.annee_publication}
                      </p>
                    )}

                    <div className="flex justify-between gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <button
                        onClick={() => navigate(`/admin/edit-book/${livre.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => supprimerLivre(livre.id)}
                        disabled={deletingId === livre.id}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingId === livre.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        currentPage === number
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}