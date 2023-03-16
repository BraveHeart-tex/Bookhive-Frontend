import { useEffect, useState } from 'react';
import BookModel from '../../../models/BookModel';
import BookImg from '../../../Images/BooksImages/book-bookhive-1000.png';

const ChangeQuantityOfBook: React.FC<{ book: BookModel }> = ({ book }) => {
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
            <button className='m-1 btn btn-md btn-danger'>Delete</button>
          </div>
        </div>
        <div className='button-container'>
          <button className='m-1 btn btn-md btn-dark main-color text-white w-50p'>
            Add Quantity
          </button>
          <button className='m-1 btn btn-md btn-warning w-50p'>
            Decrease Quantity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeQuantityOfBook;
