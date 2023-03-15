import React, { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import Spinner from '../Utils/Spinner';
import SearchBook from './components/SearchBook';
import Pagination from '../Utils/Pagination';
import { Link } from 'react-router-dom';

interface ICategory {
  name: string;
  abbreviation: string;
}

const SearchBooksPage: React.FC = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [booksPerPage, setBooksPerPage] = useState<number>(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [searchUrl, setSearchUrl] = useState<string>('');
  const [categorySelection, setCategorySelection] =
    useState<string>('Book category');

  const categories = [
    { name: 'All', abbreviation: 'All' },
    { name: 'Front End', abbreviation: 'fe' },
    { name: 'Back End', abbreviation: 'be' },
    { name: 'Data Science', abbreviation: 'data' },
    { name: 'DevOps', abbreviation: 'devops' },
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `http://localhost:8080/api/books`;

      let url: string = ``;

      if (searchUrl === '') {
        url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
      } else {
        let searchWithPage = search.replace(
          '<pageNumber>',
          `${currentPage - 1}`
        );
        url = baseUrl + searchUrl;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const resJSON = await response.json();
      const data = resJSON._embedded.books;

      setTotalAmountOfBooks(resJSON.page.totalElements);
      setTotalPages(resJSON.page.totalPages);

      const loadedBooks: BookModel[] = [];

      for (const key in data) {
        loadedBooks.push({
          id: data[key].id,
          title: data[key].title,
          author: data[key].author,
          description: data[key].description,
          copies: data[key].copies,
          copiesAvailable: data[key].copiesAvailable,
          category: data[key].category,
          img: data[key].img,
        });
      }

      setBooks(loadedBooks);
      setLoading(false);
    };

    fetchBooks().catch((error: any) => {
      setLoading(false);
      setHttpError(error.message);
    });

    window.scrollTo(0, 0);
  }, [currentPage, searchUrl]);

  if (loading) {
    return <Spinner />;
  }

  if (httpError) {
    return (
      <div className='container m-5'>
        <p>{httpError}</p>
      </div>
    );
  }

  const searchHandleChange = () => {
    setCurrentPage(1);
    if (search === '') {
      setSearchUrl('');
    } else {
      setSearchUrl(
        `/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`
      );
    }
    setCategorySelection('Book category');
  };

  const categoryField = (category: ICategory) => {
    setCurrentPage(1);
    if (
      category.abbreviation.toLowerCase() === 'fe' ||
      category.abbreviation.toLowerCase() === 'be' ||
      category.abbreviation.toLowerCase() === 'data' ||
      category.abbreviation.toLowerCase() === 'devops'
    ) {
      setCategorySelection(category.name);
      setSearchUrl(
        `/search/findByCategory?category=${category.abbreviation}&page=<pageNumber>&size=${booksPerPage}`
      );
    } else {
      setCategorySelection('All');
      setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
    }
  };

  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem =
    booksPerPage * currentPage <= totalAmountOfBooks
      ? booksPerPage * currentPage
      : totalAmountOfBooks;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className='container'>
        <div>
          <div className='row mt-5'>
            <div className='col-6'>
              <div className='d-flex'>
                <input
                  className='form-control me-2'
                  type='search'
                  placeholder='Search'
                  aria-labelledby='Search'
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className='btn btn-dark btn-outline'
                  onClick={() => searchHandleChange()}
                >
                  Search
                </button>
              </div>
            </div>
            <div className='col-4'>
              <div className='dropdown'>
                <button
                  className='btn btn-dark dropdown-toggle'
                  type='button'
                  id='dropdownMenuButton1'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  {categorySelection}
                </button>
                <ul
                  className='dropdown-menu'
                  aria-labelledby='dropdownMenuButton1'
                >
                  {categories.map((category) => (
                    <li
                      onClick={() => categoryField(category)}
                      key={category.name}
                    >
                      <a className='dropdown-item' href='#'>
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {totalAmountOfBooks > 0 ? (
            <>
              <div className='mt-3'>
                <h5>Number of results: ({totalAmountOfBooks})</h5>
              </div>
              <p>
                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks}{' '}
                items:
              </p>
              {books.map((book) => (
                <SearchBook book={book} key={book.id} />
              ))}
            </>
          ) : (
            <div className='m-5'>
              <h3>Can't find what your looking for?</h3>
              <Link
                to='/messages'
                type='button'
                className='btn btn-dark btn-md px-4 me-md-2 fw-bold text-white'
              >
                Contact library services
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default SearchBooksPage;
