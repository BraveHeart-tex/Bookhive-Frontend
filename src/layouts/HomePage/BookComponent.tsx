import React from 'react';
import BookImg from '../../Images/BooksImages/book-bookhive-1000.png';

const BookComponent: React.FC = () => {
  return (
    <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
      <div className='text-center'>
        <img src={BookImg} width='151' height='233' alt='Book' />
        <h6 className='mt-2'>Book</h6>
        <p>BookHive TR</p>
        <a href='#' className='btn main-color main-color-btn'>
          Reserve
        </a>
      </div>
    </div>
  );
};

export default BookComponent;
