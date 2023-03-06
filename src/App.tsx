import { useState } from 'react';
import './App.css';
import Navbar from './layouts/NavbarAndFooter/Navbar';
import ExploreTopBooks from './layouts/HomePage/ExploreTopBooks';

const App = () => {
  return (
    <div>
      <Navbar />
      <ExploreTopBooks />
    </div>
  );
};

export default App;
