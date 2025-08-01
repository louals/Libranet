import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import BookCard from "./BookCard";
import api from "../api";

const BookCarousel = ({ lang = "fr", t = { books: "Livres" } }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/livres/get-all");
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-center">{t.books}</h1>
      <div className="max-w-7xl mx-auto px-6 relative">
        {books.length === 0 ? (
          <p className="text-center text-gray-500">Loading books...</p>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop
            className="mySwiper py-6"
          >
            {books.map((book) => (
              <SwiperSlide key={book._id || book.id}>
                <div className="h-full flex">
                  <BookCard
                    _id={book._id || book.id}
                    titre={lang === "fr" ? book.titre : book.titre}
                    auteur={lang === "fr" ? book.auteur : book.auteur}
                    description={book.description}
                    image_url={book.image_url}
                    reservation_price={book.reservation_price}
                    stock={book.stock}
                    classification={book.classification}
                    tags={book.tags}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      
      {/* Add custom CSS to ensure consistent card dimensions */}
      <style jsx global>{`
        .swiper-slide {
          height: auto !important;
        }
        
        .book-card {
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .book-card .card-image-container {
          height: 300px; /* Fixed height for images */
          overflow: hidden;
        }
        
        .book-card .card-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .book-card .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .book-card .card-title {
          font-size: 1.125rem;
          line-height: 1.25;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .book-card .card-description {
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 1rem;
        }
        
        .book-card .card-footer {
          margin-top: auto;
        }
      `}</style>
    </section>
  );
};

export default BookCarousel;