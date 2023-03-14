import React, { useState } from 'react';
import StarsReview from './StarsReview';

const starValues: number[] = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

const LeaveReview: React.FC<{ submitReview: any }> = ({ submitReview }) => {
  const [starInput, setStarInput] = useState<number>(0);
  const [displayInput, setDisplayInput] = useState<boolean>(false);
  const [reviewDescription, setReviewDescription] = useState<string>('');

  function starValue(value: number) {
    setStarInput(value);
    setDisplayInput(true);
  }
  return (
    <div className='dropdown' style={{ cursor: 'pointer' }}>
      <h5
        className='dropdown-toggle'
        id='dropdownMenuButton1'
        data-bs-toggle='dropdown'
      >
        Leave a review?
      </h5>
      <ul
        id='submitReviewRating'
        className='dropdown-menu'
        aria-labelledby='dropdownMenuButton1'
      >
        {starValues.map((value) => (
          <li>
            <button onClick={() => starValue(value)} className='dropdown-item'>
              {value} star
            </button>
          </li>
        ))}
      </ul>
      <StarsReview rating={starInput} size={32} />
      {displayInput && (
        <form method='POST' action='#'>
          <hr />
          <div className='mb-3'>
            <label className='form-label'>Description</label>
            <textarea
              className='form-control'
              id='submitReviewDescription'
              rows={3}
              placeholder='(Optional)'
              onChange={(e) => setReviewDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <button
              type='button'
              className='btn btn-dark main-color btn-primary mt-3'
              onClick={() => submitReview(starInput, reviewDescription)}
            >
              Submit Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
export default LeaveReview;
