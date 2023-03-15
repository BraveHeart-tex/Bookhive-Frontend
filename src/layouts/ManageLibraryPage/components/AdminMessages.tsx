import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import Spinner from '../../Utils/Spinner';
import MessageModel from '../../../models/MessageModel';
import Pagination from '../../Utils/Pagination';
import AdminMessage from './AdminMessage';

const AdminMessages = () => {
  const { authState } = useOktaAuth();

  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
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
        console.log(messagesResponseJSON);

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

  if (isLoadingMessages) {
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

  return (
    <div className='mt-3'>
      {messages.length > 0 ? (
        <>
          <h5>Pending Q/A 🕖</h5>
          {messages.map((message) => (
            <AdminMessage message={message} key={message.id} />
          ))}
        </>
      ) : (
        <h5>No pending Q/A</h5>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
export default AdminMessages;
