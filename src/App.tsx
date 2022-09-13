import './App.scss';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar/NavBar';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { AddABook } from './pages/AddABook/AddABook';
import { getBooks } from './api/books';
import { Book } from './types/Book';

export const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    getBooks()
      .then(setBooks)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <NavBar />

      <div className="main page">
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={(
                <Dashboard
                  books={books}
                  setBooks={setBooks}
                  isBooksLoading={isLoading}
                />
              )}
            />
            <Route path="/home" element={<Navigate to="/" replace />} />

            <Route path="/addABook">
              <Route
                index
                element={(
                  <AddABook
                    books={books}
                    setBooks={setBooks}
                  />
                )}
              />

              <Route
                path=":bookID"
                element={(
                  <AddABook
                    books={books}
                    setBooks={setBooks}
                  />
                )}
              />
            </Route>

            <Route path="*" element={<h1>Error :(</h1>} />
          </Routes>
        </div>
      </div>
    </>
  );
};
