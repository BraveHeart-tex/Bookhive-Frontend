import React, { useState, useEffect } from 'react';
import BookImg from '../../../Images/BooksImages/book-bookhive-1000.png';
import BookComponent from './BookComponent';
import BookModel from '../../../models/BookModel';
import Spinner from '../../Utils/Spinner';
import { Link } from 'react-router-dom';

const Carousel: React.FC = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [httpError, setHttpError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `http://localhost:8080/api/books`;

      const url: string = `${baseUrl}?page=0&size=9`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const resJSON = await response.json();
      const data = resJSON._embedded.books;

      const loadedBooks: BookModel[] = [];

      for (const key in data) {
        loadedBooks.push({
          id: data[key].id,
          title: data[key].title,
          author: data[key].author,
          description: data[key].description,
          copies: data[key].copies,
          copiesAvailable: data[key].copiesAvailable,
          category: data[key].category,
          img: data[key].img,
        });
      }

      setBooks(loadedBooks);
      setLoading(false);
    };

    fetchBooks().catch((error: any) => {
      setLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (httpError) {
    return (
      <div className='container m-5'>
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div
      className='container mt-5 d-flex justify-content-center'
      style={{ minHeight: '100vh', flexDirection: 'column' }}
    >
      <div className='homepage-carousel-title'>
        <h3>Find your next bedside book.</h3>
      </div>
      <div
        id='carouselExampleControls'
        className='carousel carousel-dark slide mt-5 d-none d-lg-block'
      >
        {/* Desktop only */}
        <div className='carousel-inner'>
          <div className='carousel-item active'>
            <div className='row d-flex justify-content-center align-items-center'>
              {books.slice(0, 3).map((book) => (
                <BookComponent book={book} key={book.id} />
              ))}
            </div>
          </div>
          <div className='carousel-item'>
            <div className='row d-flex justify-content-center align-items-center'>
              {books.slice(3, 6).map((book) => (
                <BookComponent book={book} key={book.id} />
              ))}
            </div>
          </div>
          <div className='carousel-item'>
            <div className='row d-flex justify-content-center align-items-center'>
              {books.slice(6, 9).map((book) => (
                <BookComponent book={book} key={book.id} />
              ))}
            </div>
          </div>
          <button
            className='carousel-control-prev'
            type='button'
            data-bs-target='#carouselExampleControls'
            data-bs-slide='prev'
          >
            <span
              className='carousel-control-prev-icon'
              aria-hidden='true'
            ></span>
            <span className='visually-hidden'>Previous</span>
          </button>
          <button
            className='carousel-control-next'
            type='button'
            data-bs-target='#carouselExampleControls'
            data-bs-slide='next'
          >
            <span
              className='carousel-control-next-icon'
              aria-hidden='true'
            ></span>
            <span className='visually-hidden'>Next</span>
          </button>
        </div>
      </div>
      {/* Mobile only */}
      <div className='d-lg-none mt-3'>
        <div className='row d-flex justify-content-center align-items-center'>
          <BookComponent book={books[7]} key={books[7].id} />
        </div>
      </div>
      <div className='homepage-carousel-title mt-3'>
        <Link to='/search' className='btn btn-outline-dark'>
          View More
        </Link>
      </div>
    </div>
  );
};

export default Carousel;
