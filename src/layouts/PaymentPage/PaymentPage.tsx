import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import Spinner from '../Utils/Spinner';
import { CardElement } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';

const PaymentPage = () => {
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  const [fees, setFees] = useState<number>(0);
  const [loadingFees, setLoadingFees] = useState<boolean>(true);

  useEffect(() => {
    const fetchFees = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/payments/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;

        const requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const paymentResponse = await fetch(url, requestOptions);
        if (!paymentResponse.ok) {
          throw new Error('Something went wrong!');
        }
        const paymentResponseJSON = await paymentResponse.json();
        setFees(paymentResponseJSON.amount);
        setLoadingFees(false);
      }
    };
    fetchFees().catch((error: any) => {
      setLoadingFees(false);
      setHttpError(error.message);
    });
  }, [authState]);

  if (loadingFees) {
    return <Spinner />;
  }
  if (httpError) {
    return (
      <div className='container m-5'>
        <h1>An error occurred...</h1>
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div className='container'>
      {fees > 0 && (
        <div className='card mt-3'>
          <h5 className='card-header'>
            Pending fees: <span className='text-danger'>${fees}</span>
          </h5>
          <div className='card-body'>
            <h5 className='card-title mb-3'>Credit Card</h5>
            <CardElement id='card-element' />
            <button
              disabled={submitDisabled}
              type='button'
              className='btn btn-md main color text-white mt-3 btn-dark'
            >
              Pay fees
            </button>
          </div>
        </div>
      )}

      {fees === 0 && (
        <div className='mt-3'>
          <h5>You have no fees!</h5>
          <Link type='button' className='btn main-color text-white' to='search'>
            Explore our top books
          </Link>
        </div>
      )}
      {submitDisabled && <Spinner />}
    </div>
  );
};
export default PaymentPage;
