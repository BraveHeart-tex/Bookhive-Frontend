import { useState } from 'react';
import './App.css';
import Navbar from './layouts/NavbarAndFooter/Navbar';
import ExploreTopBooks from './layouts/HomePage/ExploreTopBooks';
import Carousel from './layouts/HomePage/Carousel';
import Hero from './layouts/HomePage/Hero';
import LibraryServices from './layouts/HomePage/LibraryServices';
import Footer from './layouts/NavbarAndFooter/Footer';

const App = () => {
  return (
    <div>
      <Navbar />
      <ExploreTopBooks />
      <div className='container'>
        <Carousel />
        <Hero />
        <LibraryServices />
      </div>
      <Footer />
    </div>
  );
};

export default App;
