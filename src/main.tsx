import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  'pk_test_51MnLEfIKZGibl4EQJrbDHwRDXcCOu8w4hGxR7zGAkhOlB4JABOOydRgxagQSGoNkyBEPx0SIS0c5hsWZiv7Ev35Y00rEiGFm4v'
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </BrowserRouter>
);
