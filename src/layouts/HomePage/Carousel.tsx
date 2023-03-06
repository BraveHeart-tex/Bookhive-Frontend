import React from 'react';
import BookImg from '../../Images/BooksImages/book-bookhive-1000.png';
import BookComponent from './BookComponent';

const Carousel: React.FC = () => {
  return (
    <div className='container mt-5' style={{ height: 550 }}>
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
              <BookComponent />
              <BookComponent />
              <BookComponent />
            </div>
          </div>
          <div className='carousel-item'>
            <div className='row d-flex justify-content-center align-items-center'>
              <BookComponent />
              <BookComponent />
              <BookComponent />
            </div>
          </div>
          <div className='carousel-item'>
            <div className='row d-flex justify-content-center align-items-center'>
              <BookComponent />
              <BookComponent />
              <BookComponent />
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

        {/* Mobile only */}
        <div className='d-lg-none mt-3'>
          <div className='row d-flex justify-content-center align-items-center'>
            <div className='text-center'>
              <img src={BookImg} width='151' height='233' alt='Book' />
              <h6 className='mt-2'>
                <b>Book</b>
              </h6>
              <p>BookHive TR</p>
              <a className='btn main-color main-color-btn text-white' href='#'>
                Reserve
              </a>
            </div>
          </div>
        </div>
        <div className='homepage-carousel-title mt-3'>
          <a className='btn btn-outline-secondary' href='#'>
            View More
          </a>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
