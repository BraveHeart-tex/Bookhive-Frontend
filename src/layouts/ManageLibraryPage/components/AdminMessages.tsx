import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';

const AdminMessages = () => {
  const { authState } = useOktaAuth();

  const [isLoadingMessage, setIsLoadingMessages] = useState<boolean>(true);
  const [httpError, setHttpError] = useState(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchUserMessages = async () => {};

    fetchUserMessages().catch((error: any) => {
      setIsLoadingMessages(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [authState, currentPage]);

  if (isLoadingMessage) {
    return <Spinner />;
  }

  if (httpError) {
    return (
      <div className='container m-5'>
        <h1>An error has occurred...</h1>
        <p>{httpError}</p>
      </div>
    );
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return <div>AdminMessages</div>;
};
export default AdminMessages;
