import React, { useEffect, useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { ShoppingCart, Search, BookOpen, User, Tag, X, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Books() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);


  // Fetch all unique tags from the backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/debug/all-tags");
        setTags(res.data.all_tags || []);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    };
    fetchTags();
  }, []);

  // Fetch initial books
  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch all books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/livres/get-all");
      setBooks(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  // Handle search with query and selected tags
  const fetchSearch = async () => {
    setSearching(true);
    try {
      const params = new URLSearchParams();
      
      if (searchQuery.trim()) params.append('query', searchQuery.trim());
      if (selectedTags.length > 0) {
        selectedTags.forEach(tag => params.append('tags', tag));
      }
      
      params.append('search_in_classification', 'false');
      
      const res = await api.get("/search", { 
        params,
        paramsSerializer: params => params.toString()
      });
      
      setBooks(res.data.results || []);
      setError(null);
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  // Trigger search when searchQuery or selectedTags changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() === "" && selectedTags.length === 0) {
        fetchBooks();
      } else {
        fetchSearch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTags]);

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  // Construct proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-book.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath}`;
  };

  // Handle reserve button click
  const handleReserveClick = (book, e) => {
    e.preventDefault();
    navigate(`/books/${book.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
          Our Literary Collection
        </h1>
        <div className="w-24 h-0.5 bg-blue-600 mx-auto"></div>
      </div>

      {/* Search and Filters */}
      <div className="mb-10">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, author, or description..."
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedTags.length > 0) && (
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Search: {searchQuery}
                <button 
                  onClick={() => setSearchQuery("")}
                  className="ml-2 p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {selectedTags.map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
                <button 
                  onClick={() => toggleTag(tag)}
                  className="ml-2 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            
          </div>
        )}

        {/* Tags Filter */}
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-all flex items-center ${
                  selectedTags.includes(tag)
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {selectedTags.includes(tag) && <Tag className="w-3 h-3 mr-1" />}
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Books Grid */}
      {searching ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {books.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No books found
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
              
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <motion.div
                  key={book.id}
                  className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Book Cover */}
                  <div className="relative pb-[120%] overflow-hidden">
                    <img
                      src={getImageUrl(book.image_url)}
                      alt={book.titre || "Book cover"}
                      className="absolute inset-0 w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        e.target.src = '/placeholder-book.jpg';
                      }}
                    />
                    {/* Stock Indicator */}
                    {book.stock > 0 && (
                      <div className="absolute top-2 right-2 bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                        <span className="text-xs font-semibold text-white">{book.stock} in stock</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Title and Author */}
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {book.titre || "Untitled"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 flex items-center">
                        <User className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{book.auteur || "Unknown author"}</span>
                      </p>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2 flex-grow">
                      {book.description || "No description available"}
                    </p>
                    
                    {/* Tags */}
                    <div className="mb-3 min-h-[40px]">
                      {book.tags?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {book.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full dark:bg-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {book.tags.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full dark:bg-gray-700 dark:text-gray-300">
                              +{book.tags.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No tags</span>
                      )}
                    </div>
                    
                    {/* Price and Action */}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ${book.reservation_price?.toFixed(2) || "0.00"}
                        </span>
                        {book.purchase_price && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 line-through">
                            ${book.purchase_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleReserveClick(book, e)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}