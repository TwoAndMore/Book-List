import './AddABook.scss';
import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField } from '../../components/TextField/TextField';
import { CategoriesType } from '../../enums/CategoriesType';
import { Book } from '../../types/Book';
import { createBook, updateBook } from '../../api/books';

type Props = {
  books: Book[],
  setBooks: CallableFunction,
};

export const AddABook: React.FC<Props> = (props) => {
  const {
    books,
    setBooks,
  } = props;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(`${CategoriesType.Classics}`);
  const [ISBN, setISBN] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();
  const { bookID = '' } = useParams();

  const isEditing = bookID.length > 0;

  const canSubmit = () => {
    if (title.trim().length <= 0) {
      return false;
    }

    if (author.trim().length <= 0) {
      return false;
    }

    if (ISBN.toString().trim().length <= 0) {
      return false;
    }

    return true;
  };

  const handleUpdateBook = (
    bookId: number,
    newTitle: string,
    newAuthor: string,
    newCategory: string,
    newISBN: number,
  ): void => {
    updateBook(bookId, {
      title: newTitle,
      author: newAuthor,
      category: newCategory,
      isbn: newISBN,
    })
      .then(() => setBooks((prev: Book[]) => prev.map(oldBook => {
        if (oldBook.id === bookId) {
          return {
            ...oldBook,
            title: newTitle,
            author: newAuthor,
            category: newCategory,
            isbn: newISBN,
          };
        }

        return oldBook;
      })))
      .finally(() => setIsSubmitted(true));
  };

  const handleCreateBook = async (
    event: FormEvent,
    newTitle: string,
    newAuthor: string,
    newCategory: string,
    newISBN: number,
  ) => {
    event.preventDefault();

    const optimisticResponseId = -(books.length);
    const optimisticBook = {
      id: optimisticResponseId,
      newTitle,
      newAuthor,
      newCategory,
      newISBN,
    };

    setBooks((prev: Book[]) => [...prev, optimisticBook]);

    const createdBook = await createBook({
      title: newTitle,
      author: newAuthor,
      category: newCategory,
      isbn: newISBN,
    })
      .finally(() => setIsSubmitted(true));

    setBooks((prev: Book[]) => prev.map(book => {
      return book.id === optimisticResponseId
        ? createdBook
        : book;
    }));
  };

  useEffect(() => {
    if (isEditing) {
      const foundBook = books.find(book => book.id === +bookID);

      if (!foundBook) {
        return;
      }

      setTitle(foundBook.title);
      setAuthor(foundBook.author);
      setISBN(foundBook.isbn);
      setCategory(foundBook.category);
    }
  }, []);

  const ClearFields = () => {
    setTitle('');
    setAuthor('');
    setCategory('');
    setISBN(0);
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    if (isEditing) {
      handleUpdateBook(+bookID, title, author, category, ISBN);
    } else {
      handleCreateBook(event, title, author, category, ISBN);
    }

    setTimeout(() => {
      navigate('/');
    }, 300);

    ClearFields();
  };

  return (
    <section className="page__section addBook">
      <form
        className="addBook__form"
        onSubmit={handleSubmitForm}
      >
        <TextField
          label="Title"
          value={title}
          type="text"
          onChange={setTitle}
          required
        />

        <TextField
          label="Author"
          type="text"
          value={author}
          onChange={setAuthor}
          required
        />

        <TextField
          label="ISBN"
          type="number"
          value={ISBN.toString()}
          required
          onChange={(res) => setISBN(+res)}
        />

        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="addBook__label" htmlFor="11">
          Category
        </label>

        <select
          id="11"
          className="addBook__select"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value={CategoriesType.Classics}>Classics</option>
          <option value={CategoriesType.Horror}>Horror</option>
          <option value={CategoriesType.DAM}>Detective / Mystery</option>
          <option value={CategoriesType.Fantasy}>Fantasy</option>
        </select>

        <button
          type="submit"
          className="addBook__button"
          disabled={!canSubmit()}
        >
          Add a Book
        </button>

        {isSubmitted && (
          <p className="addBook__message">
            Success
          </p>
        )}
      </form>
    </section>
  );
};
