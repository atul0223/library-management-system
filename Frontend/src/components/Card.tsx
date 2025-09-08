import React from "react";

type Book = {
  _id: string;
  title: string;
  author: string;
  ISBN: string;
  available: boolean;
};

type Props = {
  books: Book[];
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  userBorrowedBooks: Book[]; // ✅ Replace `any` with proper type
};

const Card: React.FC<Props> = ({ books, onBorrow, onReturn, userBorrowedBooks }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => {
        const isBorrowedByUser = userBorrowedBooks.some(
          (borrowedBook) => borrowedBook._id === book._id
        );

        return (
          <div
            key={book._id}
            className="border rounded-lg p-4 shadow-md bg-gray-300 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-500 text-sm">ISBN: {book.ISBN}</p>
              <p
                className={`mt-2 font-medium ${
                  book.available ? "text-green-600" : "text-red-600"
                }`}
              >
                {book.available ? "Available" : "Issued"}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              {book.available ? (
                <button
                  onClick={() => onBorrow(book._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Borrow
                </button>
              ) : isBorrowedByUser ? (
                <button
                  onClick={() => onReturn(book._id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Return
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-500 text-white rounded cursor-not-allowed"
                >
                  Not available
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;