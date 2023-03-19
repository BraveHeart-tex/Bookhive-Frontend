import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import Spinner from '../Utils/Spinner';

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

  return <div>PaymentPage</div>;
};
export default PaymentPage;
