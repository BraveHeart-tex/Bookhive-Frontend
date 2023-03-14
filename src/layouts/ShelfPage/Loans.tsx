import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import ShelfCurrentLoans from '../../models/ShelfCurrentLoans';

const Loans = () => {
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState(null);
  const [shelfCurrentLoans, setShelfCurrentLoans] = useState<
    ShelfCurrentLoans[]
  >([]);
  const [isLoadingUserLoans, setIsLoadingUserLoans] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserCurrentLoans = async () => {};

    fetchUserCurrentLoans().catch((error: any) => {
      setIsLoadingUserLoans(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [authState]);

  return <div>Loans</div>;
};
export default Loans;
