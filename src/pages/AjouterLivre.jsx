import { useState, useRef } from "react";
import {
  BookOpenCheck,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Book,
  ImagePlus,
  PenLine,
  DollarSign,
  Package,
  Upload,
  X,
  ArrowLeft,
  Tags,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AjouterLivre() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    titre: "",
    auteur: "",
    description: "",
    purchase_price: "",
    reservation_price: "",
    stock: "",
    classification: "",
    tags: []
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [tempTag, setTempTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addTag = () => {
    if (tempTag.trim() && !formData.tags.includes(tempTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tempTag.trim()]
      }));
      setTempTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const data = new FormData();
      data.append("titre", formData.titre);
      data.append("auteur", formData.auteur);
      data.append("description", formData.description);
      data.append("purchase_price", formData.purchase_price);
      data.append("reservation_price", formData.reservation_price);
      data.append("stock", formData.stock);
      data.append("classification", formData.classification);
      formData.tags.forEach(tag => data.append("tags[]", tag));
      
      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await axios.post(
        "http://localhost:8000/livres/create",
        data,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );

      setSuccess(true);
      setFormData({
        titre: "",
        auteur: "",
        description: "",
        purchase_price: "",
        reservation_price: "",
        stock: "",
        classification: "",
        tags: []
      });
      setImageFile(null);
      setPreviewImage("");
      
      setTimeout(() => {
        navigate("/admin/livres");
      }, 2000);
    } catch (err) {
      console.error("Erreur ajout livre:", err);
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'ajout du livre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-900 p-4 md:p-8">
      <motion.div
        className="max-w-4xl mx-auto bg-white dark:bg-blue-800 rounded-sm shadow-sm overflow-hidden border border-blue-100 dark:border-blue-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-blue-900 p-6 text-white border-b border-blue-800">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate("/admin/livres ")}
              className="flex items-center gap-2 hover:bg-white/5 p-2 rounded-sm transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline font-light">Retour</span>
            </button>
            <h1 className="text-xl md:text-2xl font-light tracking-wide flex items-center gap-3">
              <BookOpenCheck className="w-5 h-5" />
              Ajouter un Nouveau Livre
            </h1>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-light text-blue-700 dark:text-blue-300 mb-2">
                  Titre du Livre *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="titre"
                    value={formData.titre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Le Petit Prince"
                    className="w-full px-4 py-2.5 rounded-sm bg-white dark:bg-blue-700 border border-blue-200 dark:border-blue-600 focus:ring-1 focus:ring-blue-400 focus:border-transparent font-light tracking-wide"
                  />
                  <Book className="absolute right-3 top-3 text-blue-400" />
                </div>
              </div>

              {/* Auteur */}
              <div>
                <label className="block text-sm font-light text-blue-700 dark:text-blue-300 mb-2">
                  Auteur *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="auteur"
                    value={formData.auteur}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Antoine de Saint-Exupéry"
                    className="w-full px-4 py-2.5 rounded-sm bg-white dark:bg-blue-700 border border-blue-200 dark:border-blue-600 focus:ring-1 focus:ring-blue-400 focus:border-transparent font-light tracking-wide"
                  />
                  <PenLine className="absolute right-3 top-3 text-blue-400" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-light text-blue-700 dark:text-blue-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  placeholder="Résumé du livre, thèmes abordés..."
                  className="w-full px-4 py-2.5 rounded-sm bg-white dark:bg-blue-700 border border-blue-200 dark:border-blue-600 focus:ring-1 focus:ring-blue-400 focus:border-transparent font-light tracking-wide"
                ></textarea>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-light text-blue-700 dark:text-blue-300 mb-2">
                  Couverture du Livre *
                </label>
                <div className="flex items-center gap-4">
                  {previewImage && (
                    <div className="relative group">
                      <img
                        src={previewImage}
                        alt="Book preview"
                        className="h-40 w-32 object-cover rounded-sm border border-blue-200 dark:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-blue-800 text-white rounded-full p-1 hover:bg-blue-700 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center w-full h-40 border border-dashed border-blue-300 dark:border-blue-600 rounded-sm cursor-pointer bg-blue-50 dark:bg-blue-700 hover:bg-blue-100 dark:hover:bg-blue-600/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 mb-3 text-blue-400" />
                        <p className="mb-2 text-sm text-blue-500 dark:text-blue-400 font-light">
                          <span>Cliquez pour upload</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-blue-500 dark:text-blue-400 font-light">
                          PNG, JPG (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required={!previewImage}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-light text-blue-700 dark:text-blue-300 mb-2">
                  Mots-clés (Tags)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempTag}
                    onChange={(e) => setTempTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Ajouter un tag"
                    className="flex-1 px-4 py-2.5 rounded-sm bg-white dark:bg-blue-700 border border-blue-200 dark:border-blue-600 focus:ring-1 focus:ring-blue-400 focus:border-transparent font-light tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2.5 bg-blue-800 hover:bg-blue-700 text-white rounded-sm transition-colors"
                  >
                    <Tags className="h-4 w-4" />
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <motion.span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-sm bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 text-xs font-light tracking-wide border border-blue-200 dark:border-blue-600"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              {/* Purchase Price */}
              <div>
                <label className="block text-sm font-light text-blue-700 dark:text-blue-300 mb-2">
                  Prix d'achat *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="purchase_price"
                    value={formData.purchase_price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-sm bg-white dark:bg-blue-700 border border-blue-200 dark:border-blue-600 focus:ring-1 focus:ring-blue-400 focus:border-transparent font-light tracking-wide pl-8"
                  />
                  <DollarSign className="absolute left-3 top-3 text-blue-400 h-3 w-3" />
                </div>
              </div>

              {/* Reservation Price */}
              <div>
                <label className="block text-sm font-light text-blue-700 dark:text-blue-300 mb-2">
                  Prix de réservation *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="reservation_price"
                    value={formData.reservation_price}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-sm bg-white dark:bg-blue-700 border border-blue-200 dark:border-blue-600 focus:ring-1 focus:ring-blue-400 focus:border-transparent font-light tracking-wide pl-8"
                  />
                  <DollarSign className="absolute left-3 top-3 text-blue-400 h-3 w-3" />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-light text-blue-700 dark:text-blue-300 mb-2">
                  Stock disponible *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-sm bg-white dark:bg-blue-700 border border-blue-200 dark:border-blue-600 focus:ring-1 focus:ring-blue-400 focus:border-transparent font-light tracking-wide pl-8"
                  />
                  <Package className="absolute left-3 top-3 text-blue-400 h-3 w-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-blue-100 dark:border-blue-700">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-light tracking-wide rounded-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>En cours...</span>
                </>
              ) : (
                <>
                  <BookOpenCheck className="h-4 w-4" />
                  <span>Ajouter le Livre</span>
                </>
              )}
            </motion.button>
          </div>
        </form>

        {/* Status Messages */}
        <div className="px-6 pb-6">
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded-sm flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-300" />
                <span className="font-light">Livre ajouté avec succès! Redirection en cours...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-sm flex items-center gap-3"
              >
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
                <span className="font-light">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}