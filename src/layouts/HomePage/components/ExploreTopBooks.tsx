import React from 'react';

const ExploreTopBooks: React.FC = () => {
  return (
    <div
      className='p-5 mb-4 bg-dark header d-flex'
      style={{ minHeight: '100vh' }}
    >
      <div className='container-fluid py-5 text-white d-flex justify-content-center align-items-center'>
        <div style={{}}>
          <h1 className='display-5 fw-bold '>
            📚 Venture into different worlds
          </h1>
          <p className='col-md-8 fs-4' style={{ color: '#ced4da' }}>
            ✨ Where would you like to go next? ✨
          </p>
          <a
            className='btn main-color main-color-btn btn-lg text-white'
            type='button'
            href='#'
          >
            Explore top books
          </a>
        </div>
      </div>
    </div>
  );
};

export default ExploreTopBooks;
