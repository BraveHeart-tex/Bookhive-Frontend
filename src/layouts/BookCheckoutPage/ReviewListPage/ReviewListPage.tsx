import React, { useEffect, useState } from 'react';
import ReviewModel from '../../../models/ReviewModel';
import Spinner from '../../Utils/Spinner';
import Review from '../../Utils/Review';
import Pagination from '../../Utils/Pagination';

const ReviewListPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [httpError, setHttpError] = useState(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reviewsPerPage] = useState<number>(5);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const bookId = window.location.pathname.split('/')[2];

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `http://bookhive-env.eba-7rvhnjpe.eu-north-1.elasticbeanstalk.com/api/reviews/search/findByBookId?bookId=${bookId}&page=${
        currentPage - 1
      }&size=${reviewsPerPage}`;

      const responseReviews = await fetch(reviewUrl);

      if (!responseReviews.ok) {
        throw new Error('Something went wrong!');
      }

      const responseJSON = await responseReviews.json();

      const responseData = responseJSON._embedded.reviews;

      setTotalAmountOfReviews(responseJSON.page.totalElements);
      setTotalPages(responseJSON.page.totalPages);

      const loadedReviews: ReviewModel[] = [];

      for (const key in responseData) {
        loadedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          book_id: responseData[key].book_id,
          reviewDescription: responseData[key].reviewDescription,
        });
      }

      setReviews(loadedReviews);
      setIsLoading(false);
    };

    fetchBookReviews().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [currentPage]);

  if (isLoading) {
    return <Spinner />;
  }

  if (httpError) {
    <div className='container m-5'>
      <h1>An error has occurred 🙁</h1>
      <p className='text-danger'>{httpError}</p>
    </div>;
  }

  const indexOfLastReview: number = currentPage * reviewsPerPage;
  const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

  let lastItem =
    reviewsPerPage * currentPage <= totalAmountOfReviews
      ? reviewsPerPage * currentPage
      : totalAmountOfReviews;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='cotaniner m-5'>
      <div>
        <h3>Comments: ({reviews.length})</h3>
      </div>
      <p>
        {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items
      </p>
      <div className='row'>
        {reviews.map((review) => (
          <Review review={review} key={review.id} />
        ))}
      </div>

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
export default ReviewListPage;
