import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import Spinner from '../Utils/Spinner';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';
import PaymentInfoRequest from '../../models/PaymentInfoRequest';

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

  const elements = useElements();
  const stripe = useStripe();

  async function checkout() {
    if (!stripe || !elements || !elements.getElement(CardElement)) {
      return;
    }

    setSubmitDisabled(true);

    let paymentInfo = new PaymentInfoRequest(
      Math.round(fees * 100),
      'TRY',
      authState?.accessToken?.claims.sub
    );

    const url = `https://localhost:8080/api/payment/secure/payment-intent`;
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentInfo),
    };
    const stripeResponse = await fetch(url, requestOptions);
    if (!stripeResponse.ok) {
      setHttpError(true);
      setSubmitDisabled(false);
      throw new Error('Something went wrong!');
    }
    const stripeResponseJSON = await stripeResponse.json();

    stripe
      .confirmCardPayment(
        stripeResponseJSON._client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              email: authState?.accessToken?.claims.sub,
            },
          },
        },
        { handleActions: false }
      )
      .then(async function (result: any) {
        if (result.error) {
          setSubmitDisabled(false);
          alert('There was an error...');
        } else {
          const url = `https://localhost:8080/api/payment/secure/payment-complete`;
          const requestOptions = {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
              'Content-Type': 'application/json',
            },
          };
          const stripeResponse = await fetch(url, requestOptions);
          if (!stripeResponse.ok) {
            console.error(stripeResponse.statusText);
            setHttpError(true);
            setSubmitDisabled(false);
            throw new Error('Something went wrong...');
          }
          setFees(0);
          setSubmitDisabled(false);
        }
      });
    setHttpError(false);
  }

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
              onClick={checkout}
            >
              Pay fees
            </button>
          </div>
        </div>
      )}

      {fees === 0 && (
        <div className='mt-3 generic-center'>
          <h5>You have no fees!</h5>
          <Link
            type='button'
            className='btn btn-dark main-color text-white'
            to='search'
          >
            Explore our top books
          </Link>
        </div>
      )}
      {submitDisabled && <Spinner />}
    </div>
  );
};
export default PaymentPage;
