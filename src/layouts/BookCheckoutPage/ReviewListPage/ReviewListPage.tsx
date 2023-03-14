import React, { useState } from 'react';
import ReviewModel from '../../../models/ReviewModel';

const ReviewListPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [httpError, setHttpError] = useState(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [reviewsPerPage] = useState<number>(5);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const bookId = window.location.pathname.split('/')[2];

  return <div>ReviewListPage</div>;
};
export default ReviewListPage;
