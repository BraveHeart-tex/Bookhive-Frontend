import React, { useEffect, useState } from 'react';
import ReviewModel from '../../../models/ReviewModel';
import Spinner from '../../Utils/Spinner';

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
      const reviewUrl: string = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${
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

  return <div>ReviewListPage</div>;
};
export default ReviewListPage;
