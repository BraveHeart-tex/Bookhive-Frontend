import { useOktaAuth } from '@okta/okta-react';
import { useState } from 'react';
import AddBookRequest from '../../../models/AddBookRequest';

interface ICategory {
  name: string;
  abbreviation: string;
}

export const AddNewBook = () => {
  const { authState } = useOktaAuth();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [copies, setCopies] = useState(0);
  const [category, setCategory] = useState('Category');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  function categoryField(value: string) {
    setCategory(value);
  }

  const categoryFields: ICategory[] = [
    { name: 'Front End', abbreviation: 'FE' },
    { name: 'Back End', abbreviation: 'BE' },
    { name: 'DevOps', abbreviation: 'DevOps' },
    { name: 'Data', abbreviation: 'Data' },
  ];

  async function base64ConversionForImages(e: any) {
    if (e.target.files[0]) {
      getBase64(e.target.files[0]);
    }
  }

  function getBase64(file: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setSelectedImage(reader.result);
    };
    reader.onerror = function (error) {
      console.error('An error has occurred', error);
    };
  }

  async function submitNewBook() {
    const url = `http://bookhive-env.eba-7rvhnjpe.eu-north-1.elasticbeanstalk.com/api/admin/secure/add/book`;
    if (
      authState?.isAuthenticated &&
      title !== '' &&
      author !== '' &&
      category !== 'Category' &&
      description !== '' &&
      copies > 0
    ) {
      const book: AddBookRequest = new AddBookRequest(
        title,
        author,
        description,
        copies,
        category
      );

      book.img = selectedImage;
      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authState.accessToken?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      };

      const submitNewBookResponse = await fetch(url, requestOptions);
      if (!submitNewBookResponse.ok) {
        throw new Error('Something went wrong');
      }
      setTitle('');
      setAuthor('');
      setDescription('');
      setCopies(0);
      setSelectedImage(null);
      setDisplayWarning(false);
      setDisplaySuccess(true);
    } else {
      setDisplayWarning(true);
      setDisplaySuccess(false);
    }
  }

  return (
    <div className='container mt-5 mb-5'>
      {displaySuccess && (
        <div className='alert alert-success' role='alert'>
          Book added successfully
        </div>
      )}
      {displayWarning && (
        <div className='alert alert-danger' role='alert'>
          All fields must be filled out
        </div>
      )}
      <div className='card'>
        <div className='card-header'>Add a new book</div>
        <div className='card-body'>
          <form method='POST'>
            <div className='row'>
              <div className='col-md-6 mb-3'>
                <label className='form-label'>Title</label>
                <input
                  type='text'
                  className='form-control'
                  name='title'
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </div>
              <div className='col-md-3 mb-3'>
                <label className='form-label'> Author </label>
                <input
                  type='text'
                  className='form-control'
                  name='author'
                  required
                  onChange={(e) => setAuthor(e.target.value)}
                  value={author}
                />
              </div>
              <div className='col-md-3 mb-3'>
                <label className='form-label'> Category</label>
                <button
                  className='form-control btn btn-secondary dropdown-toggle'
                  type='button'
                  id='dropdownMenuButton1'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  {category}
                </button>
                <ul
                  id='addNewBookId'
                  className='dropdown-menu'
                  aria-labelledby='dropdownMenuButton1'
                >
                  {categoryFields.map((category) => (
                    <li key={category.abbreviation}>
                      <a
                        onClick={() => categoryField(category.abbreviation)}
                        className='dropdown-item'
                      >
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='col-md-12 mb-3'>
              <label className='form-label'>Description</label>
              <textarea
                className='form-control'
                id='exampleFormControlTextarea1'
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              ></textarea>
            </div>
            <div className='col-md-3 mb-3'>
              <label className='form-label'>Copies</label>
              <input
                type='number'
                className='form-control'
                name='Copies'
                required
                onChange={(e) => setCopies(Number(e.target.value))}
                value={copies}
              />
            </div>
            <label className='custom-file-upload'>
              <input
                type='file'
                id='upload-image'
                onChange={(e) => base64ConversionForImages(e)}
              />
              Choose file
            </label>
            <div>
              <button
                type='button'
                className='btn btn-dark main-color mt-3'
                onClick={submitNewBook}
              >
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
