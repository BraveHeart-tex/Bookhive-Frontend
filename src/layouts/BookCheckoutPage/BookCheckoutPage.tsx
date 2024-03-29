import { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import Spinner from '../Utils/Spinner';
import BookImg from '../../Images/BooksImages/book-bookhive-1000.png';
import StarsReview from '../Utils/StarsReview';
import CheckoutAndReviewBox from './CheckoutAndReviewBox';
import LatestReviews from './LatestReviews';
import { useOktaAuth } from '@okta/okta-react';
import ReviewRequestModel from '../../models/ReviewRequestModel';
import ReviewModel from '../../models/ReviewModel';

const BookCheckoutPage = () => {
  const { authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [httpError, setHttpError] = useState(null);

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(true);

  const [isReviewLeft, setIsReviewLeft] = useState<boolean>(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState<boolean>(true);

  const [currentLoansCount, setCurrentLoansCount] = useState<number>(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState<boolean>(true);

  const [isCheckedOut, setIsCheckedOut] = useState<boolean>(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] =
    useState<boolean>(true);

  const [displayError, setDisplayError] = useState<boolean>(false);

  const bookId = window.location.pathname.split('/')[2];

  useEffect(() => {
    const fetchBook = async () => {
      const baseUrl: string = `http://bookhive-env.eba-7rvhnjpe.eu-north-1.elasticbeanstalk.com/api/books/${bookId}`;

      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const responseJson = await response.json();

      const loadedBook: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };

      setBook(loadedBook);
      setIsLoading(false);
    };

    fetchBook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `http://bookhive-env.eba-7rvhnjpe.eu-north-1.elasticbeanstalk.com/api/reviews/search/findByBookId?bookId=${bookId}`;

      const responseReviews = await fetch(reviewUrl);

      if (!responseReviews.ok) {
        throw new Error('Something went wrong!');
      }

      const responseJSON = await responseReviews.json();

      const responseData = responseJSON._embedded.reviews;

      const loadedReviews: ReviewModel[] = [];

      let weightedStarReviews: number = 0;

      for (const key in responseData) {
        loadedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          book_id: responseData[key].book_id,
          reviewDescription: responseData[key].reviewDescription,
        });
        weightedStarReviews += responseData[key].rating;
      }

      if (loadedReviews) {
        const round = (
          Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1);
        setTotalStars(Number(round));
      }

      setReviews(loadedReviews);
      setIsLoadingReview(false);
    };

    fetchBookReviews().catch((error: any) => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [isReviewLeft]);

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://bookhive-env.eba-7rvhnjpe.eu-north-1.elasticbeanstalk.com/api/reviews/secure/user/book/?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        };

        const userReview = await fetch(url, requestOptions);

        if (!userReview.ok) {
          throw new Error('Something went wrong...');
        }
        const userReviewResponseJSON = await userReview.json();
        setIsReviewLeft(userReviewResponseJSON);
        setIsLoadingUserReview(false);
      }
    };

    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
      console.error(error.message);
      setHttpError(error.message);
    });
  }, [authState]);

  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://bookhive-env.eba-7rvhnjpe.eu-north-1.elasticbeanstalk.com/api/books/secure/currentloans/count`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        };
        const currentLoansCountResponse = await fetch(url, requestOptions);
        if (!currentLoansCountResponse.ok) {
          throw new Error('Something went wrong.');
        }
        const currentLoansResponseJson = await currentLoansCountResponse.json();
        setCurrentLoansCount(currentLoansResponseJson);
      }
      setIsLoadingCurrentLoansCount(false);
    };

    fetchUserCurrentLoansCount().catch((error: any) => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(error.message);
    });
  }, [authState, isCheckedOut]);

  useEffect(() => {
    const fetchUserCheckedOutBook = async () => {
      if (authState && authState?.isAuthenticated) {
        const url = `http://bookhive-env.eba-7rvhnjpe.eu-north-1.elasticbeanstalk.com/api/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        };
        const bookCheckedOut = await fetch(url, requestOptions);

        if (!bookCheckedOut.ok) {
          console.error(bookCheckedOut.statusText);
          throw new Error('Something went wrong');
        }

        const bookCheckedOutResponseJson = await bookCheckedOut.json();
        setIsCheckedOut(bookCheckedOutResponseJson);
      }
      setIsLoadingBookCheckedOut(false);
    };

    fetchUserCheckedOutBook().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    });
  }, [authState]);

  if (
    isLoading ||
    isLoadingReview ||
    isLoadingCurrentLoansCount ||
    isLoadingBookCheckedOut ||
    isLoadingUserReview
  ) {
    return <Spinner />;
  }

  if (!authState?.isAuthenticated) {
    return (
      <div className='container m-5 text-center'>
        <h1 className='text-danger'>You must be authenticated to see books.</h1>
        <p className='alert'>
          You can use the following account for testing:{' '}
          <em>testuser@email.com </em> <em>password1234</em>
        </p>
      </div>
    );
  }

  if (httpError) {
    return (
      <div className='container m-5 text-center'>
        <h1 className='text-danger'>Sorry, there was an error :(</h1>
        <p className='text-danger'>{httpError}</p>
      </div>
    );
  }

  async function checkOutBook() {
    const url = `http://bookhive-env.eba-7rvhnjpe.eu-north-1.elasticbeanstalk.com/api/books/secure/checkout/?bookId=${book?.id}`;
    const requestOptions = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      setDisplayError(true);
      console.error(checkoutResponse.statusText);
      throw new Error('Something went wrong');
    }
    setDisplayError(false);
    setIsCheckedOut(true);
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }
    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription
    );
    const url = `http://bookhive-env.eba-7rvhnjpe.eu-north-1.elasticbeanstalk.com/api/reviews/secure`;
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewRequestModel),
    };

    const returnResponse = await fetch(url, requestOptions);

    if (!returnResponse.ok) {
      throw new Error('Something went wrong...');
    }
    setIsReviewLeft(true);
  }

  return (
    <div>
      <div className='container d-none d-lg-block'>
        {displayError && (
          <div className='alert alert-danger mt-3' role='alter'>
            To checkout a book, please pay your current fees and / or return
            late book(s).
          </div>
        )}
        <div className='row mt-5'>
          <div className='col-sm-2 col-md-2'>
            {book?.img ? (
              <img src={book?.img} width='226' height='349' alt={book.title} />
            ) : (
              <img src={BookImg} width='226' height='349' alt='BookHive' />
            )}
          </div>
          <div className='col-4 col-md-4 container'>
            <div className='ml-2'>
              <h2>{book?.title}</h2>
              <h5 className='text-primary'>{book?.author}</h5>
              <p className='lead'>{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            book={book}
            mobile={false}
            currentLoansCount={currentLoansCount}
            isAuthenticated={authState?.isAuthenticated}
            isCheckedOut={isCheckedOut}
            checkOutBook={checkOutBook}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      <div className='container d-lg-none mt-5'>
        {displayError && (
          <div className='alert alert-danger mt-3' role='alter'>
            To checkout a book, please pay your current fees and / or return
            late book(s).
          </div>
        )}
        <div className='d-flex justify-content-center align-items-center'>
          {book?.img ? (
            <img src={book?.img} width='226' height='349' alt='Book' />
          ) : (
            <img src={BookImg} width='226' height='349' alt='Book' />
          )}
        </div>
        <div className='mt-4'>
          <div className='ml-2'>
            <h2>{book?.title}</h2>
            <h5 className='text-primary'>{book?.author}</h5>
            <p className='lead'>{book?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoansCount={currentLoansCount}
          isAuthenticated={authState?.isAuthenticated}
          isCheckedOut={isCheckedOut}
          checkOutBook={checkOutBook}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};

export default BookCheckoutPage;
