import React from 'react';
import BookImg from '../../../Images/BooksImages/book-bookhive-1000.png';
import BookModel from '../../../models/BookModel';

const BookComponent: React.FC<{ book: BookModel }> = ({ book }) => {
  return (
    <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
      <div className='text-center'>
        {book.img ? (
          <img
            src={book.img}
            width='151'
            height='233'
            style={{ height: '233px', width: '151px' }}
            alt='Book'
            className='rounded'
          />
        ) : (
          <img
            src={BookImg}
            width='151'
            height='233'
            style={{ height: '233px', width: '151px' }}
            alt='Book'
            className='rounded'
          />
        )}
        <h6 className='mt-2'>{book.title}</h6>
        <p>{book.author}</p>
        <a href='#' className='btn main-color main-color-btn'>
          Reserve
        </a>
      </div>
    </div>
  );
};

export default BookComponent;
