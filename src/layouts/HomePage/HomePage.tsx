import React from 'react';
import Carousel from './components/Carousel';
import Hero from './components/Hero';
import LibraryServices from './components/LibraryServices';
import ExploreTopBooks from './components/ExploreTopBooks';

const HomePage: React.FC = () => {
  return (
    <>
      <ExploreTopBooks />
      <div className='container'>
        <Carousel />
        <Hero />
        <LibraryServices />
      </div>
    </>
  );
};

export default HomePage;
