import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import MessageModel from '../../../models/MessageModel';

const AdminMessages = () => {
  const { authState } = useOktaAuth();

  const [isLoadingMessage, setIsLoadingMessages] = useState<boolean>(true);
  const [httpError, setHttpError] = useState(null);

  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesPerPage] = useState(5);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchUserMessages = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8080/api/messages/search/findByClosed/?closed=false&page=${
          currentPage - 1
        }&size=${messagesPerPage}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        };
        const messagesResponse = await fetch(url, requestOptions);
        if (!messagesResponse.ok) {
          throw new Error('Something went wrong...');
        }

        const messagesResponseJSON = await messagesResponse.json();
        setMessages(messagesResponseJSON._embedded.messages);
        setTotalPages(messagesResponseJSON.page.totalPages);
      }
      setIsLoadingMessages(false);
    };

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
