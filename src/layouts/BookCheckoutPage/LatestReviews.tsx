import React from 'react';
import { Link } from 'react-router-dom';
import Review from '../Utils/Review';
import ReviewModel from '../../models/ReviewModel';

const LatestReviews: React.FC<{
  reviews: ReviewModel[];
  bookId: number | undefined;
  mobile: boolean;
}> = ({ reviews, bookId, mobile }) => {
  return (
    <div className={mobile ? 'mt-3' : 'row mt-5'}>
      <div className={mobile ? '' : 'col-sm-2 col-md-2'}>
        <h2>Latest Reviews: </h2>
      </div>
      <div className='col-sm-10 col-md-10'>
        {reviews.length > 0 ? (
          <>
            {reviews.slice(0, 3).map((eachReview) => (
              <Review review={eachReview} key={eachReview.id}></Review>
            ))}

            <div className='m-3'>
              <Link
                type='button'
                className='btn btn-dark main-color btn-md text-white'
                to={`/reviewlist/${bookId}`}
              >
                Read all reviews.
              </Link>
            </div>
          </>
        ) : (
          <div className='m-3'>
            <p className='lead'>Currently there are no reviews for this book</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default LatestReviews;
