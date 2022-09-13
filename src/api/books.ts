import { client } from '../utils/fetchClient';
import { Book } from '../types/Book';

export const getBooks = () => {
  return client.get<Book[]>('/books');
};

export const createBook = (data: {}) => {
  return client.post('/books', data);
};

export const deleteBook = (bookId: number) => {
  return client.delete(`/books/${bookId}`);
};

export const updateBook = (bookId: number, data: {}) => {
  return client.patch(`/books/${bookId}`, data);
};
