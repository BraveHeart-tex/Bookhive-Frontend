import { useOktaAuth } from '@okta/okta-react';
import { useState } from 'react';

const PostNewMessage = () => {
  const { authState } = useOktaAuth();
  const [title, setTitle] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [displayWarning, setDisplayWarning] = useState<boolean>(false);
  const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);

  return (
    <div className='card mt-3'>
      {displaySuccess && (
        <div className='alert alert-success' role='alert'>
          Question added successfully
        </div>
      )}
      <div className='card-header'>
        &mdash; Feel free to ask any question to our{' '}
        <b>
          <i>BookHive</i>
        </b>{' '}
        Admins 😇
      </div>
      <div className='card-body'>
        <form method='POST'>
          {displayWarning && (
            <div className='alert alert-danger' role='alert'>
              All fields must be filled out
            </div>
          )}

          <div className='mb-3'>
            <label className='form-label'>Title</label>
            <input
              type='text'
              className='form-control'
              id='exampleFormControlInput1'
              placeholder='Title'
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>

          <div className='mb-3'>
            <label className='form-label'>Question</label>
            <textarea
              className='form-control'
              id='exampleFormControlTextarea1'
              rows={3}
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            ></textarea>
          </div>
          <div>
            <button
              type='button'
              className='btn btn-dark main-color btn-primary mt-3'
            >
              Submit Question 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostNewMessage;
