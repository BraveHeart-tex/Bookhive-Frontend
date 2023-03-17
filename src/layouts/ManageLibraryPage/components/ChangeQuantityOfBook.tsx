import { useEffect, useState } from 'react';
import BookModel from '../../../models/BookModel';
import BookImg from '../../../Images/BooksImages/book-bookhive-1000.png';
import { useOktaAuth } from '@okta/okta-react';

const ChangeQuantityOfBook: React.FC<{
  book: BookModel;
  deleteBook: () => void;
}> = ({ book, deleteBook }) => {
  const { authState } = useOktaAuth();
  const [quantity, setQuantity] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    const fetchBookInState = () => {
      book.copies ? setQuantity(book.copies) : setQuantity(0);
      book.copiesAvailable
        ? setRemaining(book.copiesAvailable)
        : setRemaining(0);
    };
    fetchBookInState();
  }, []);

  async function increaseBookQuantity() {
    const url = `http://localhost:8080/api/admin/secure/increase/book/quantity/?bookId=${book.id}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const quantityIncreaseResponse = await fetch(url, requestOptions);
    if (!quantityIncreaseResponse.ok) {
      throw new Error('Something went wrong...');
    }
    setQuantity(quantity + 1);
    setRemaining(remaining + 1);
  }

  async function decreaseQuantity() {
    const url = `http://localhost:8080/api/admin/secure/decrease/book/quantity/?bookId=${book.id}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const quantityDecreaseResponse = await fetch(url, requestOptions);
    if (!quantityDecreaseResponse.ok) {
      throw new Error('Something went wrong...');
    }
    setQuantity(quantity - 1);
    setRemaining(remaining - 1);
  }

  async function deleteBookFunction() {
    const url = `http://localhost:8080/api/admin/secure/delete/book/?bookId=${book.id}`;
    const requestOptions = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const deleteBookResponse = await fetch(url, requestOptions);
    if (!deleteBookResponse.ok) {
      throw new Error('Something went wrong...');
    }
    deleteBook();
  }

  return (
    <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
      <div className='row g-0'>
        <div className='col-md-2'>
          <div className='d-none d-lg-block'>
            {book.img ? (
              <img src={book.img} width='123' height='196' alt='Book' />
            ) : (
              <img src={BookImg} width='123' height='196' alt='Book' />
            )}
          </div>
          <div className='d-lg-none d-flex justify-content-center align-items-center'>
            {book.img ? (
              <img src={book.img} width='123' height='196' alt='Book' />
            ) : (
              <img src={BookImg} width='123' height='196' alt='Book' />
            )}
          </div>
        </div>
        <div className='col-md-6'>
          <div className='card-body'>
            <h5 className='card-title'>{book.author}</h5>
            <h4>{book.title}</h4>
            <p className='card-text'> {book.description} </p>
          </div>
        </div>
        <div className='mt-3 col-md-4'>
          <div className='d-flex justify-content-center align-items-center'>
            <p>
              Total Quantity: <b>{quantity}</b>
            </p>
          </div>
          <div className='d-flex justify-content-center align-items-center'>
            <p>
              Books Remaining: <b>{remaining}</b>
            </p>
          </div>
        </div>
        <div className='mt-3 col-md-1'>
          <div className='d-flex justify-content-start'>
            <button
              className='m-1 btn btn-md btn-danger'
              onClick={deleteBookFunction}
            >
              Delete
            </button>
          </div>
        </div>
        <div className='button-container'>
          <button
            className='m-1 btn btn-md btn-dark main-color text-white w-50p'
            onClick={increaseBookQuantity}
          >
            Add Quantity
          </button>
          <button
            className='m-1 btn btn-md btn-warning w-50p'
            onClick={decreaseQuantity}
          >
            Decrease Quantity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeQuantityOfBook;
