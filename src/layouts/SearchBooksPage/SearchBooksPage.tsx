import React, { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import Spinner from '../Utils/Spinner';
import SearchBook from './components/SearchBook';
import Pagination from '../Utils/Pagination';

const SearchBooksPage: React.FC = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [booksPerPage, setBooksPerPage] = useState<number>(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `http://localhost:8080/api/books`;

      const url: string = `${baseUrl}?page=${
        currentPage - 1
      }&size=${booksPerPage}`;

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
  }, [currentPage]);

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
                />
                <button className='btn btn-dark btn-outline'>Search</button>
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
                  Category
                </button>
                <ul
                  className='dropdown-menu'
                  aria-labelledby='dropdownMenuButton1'
                >
                  <li>
                    <a className='dropdown-item' href='#'>
                      All
                    </a>
                  </li>
                  <li>
                    <a className='dropdown-item' href='#'>
                      Front End
                    </a>
                  </li>
                  <li>
                    <a className='dropdown-item' href='#'>
                      Back End
                    </a>
                  </li>
                  <li>
                    <a className='dropdown-item' href='#'>
                      Data
                    </a>
                  </li>
                  <li>
                    <a className='dropdown-item' href='#'>
                      DevOps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='mt-3'>
            <h5>Number of results: ({totalAmountOfBooks})</h5>
          </div>
          <p>
            {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
          </p>
          {books.map((book) => (
            <SearchBook book={book} key={book.id} />
          ))}
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
