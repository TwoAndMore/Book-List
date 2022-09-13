import './Dashboard.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../../types/Book';
import { deleteBook } from '../../api/books';
import { Loader } from '../../components/Loader/Loader';

type Props = {
  books: Book[],
  setBooks: CallableFunction,
  isBooksLoading: boolean,
};

export const Dashboard: React.FC<Props> = (props) => {
  const {
    books,
    isBooksLoading,
    setBooks,
  } = props;

  const handleDeleteBook = (bookId: number): void => {
    deleteBook(bookId)
      .then(() => {
        setBooks((prev: Book[]) => prev.filter(book => book.id !== bookId));
      });
  };

  return (
    <section className="page__section dashboard">
      {isBooksLoading ? (
        <Loader />
      ) : (
        <>
          {books.length <= 0 ? (
            <p>There is no books on the server/ Server Error</p>
          ) : (
            <table className="dashboard__table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>ISBN</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map(book => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{book.isbn}</td>
                    <td>
                      <Link
                        to={`/addABook/${book.id}`}
                        className="dashboard__link"
                      >
                        <button
                          type="button"
                          className="dashboard__button"
                        >
                          Edit
                        </button>
                      </Link>

                      <button
                        type="button"
                        className="dashboard__button dashboard__button--red"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </section>
  );
};
