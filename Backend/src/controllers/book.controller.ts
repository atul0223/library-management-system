import Book from "../models/book.model";
import User from "../models/user.model";
import { Request, Response } from "express";


export const addBook = async (req: Request, res: Response) => {
  const { title, author, isbn } = req.body;
  if (![title, author, isbn].every(Boolean)) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const book = await Book.create({ title, author, isbn, available: true });
  res.status(201).json({ message: "Book added", book });
};

// Fetch all available books
export const getAvailableBooks = async (_req: Request, res: Response) => {
  const books = await Book.find();
  res.status(200).json({ books });
};

// Search books by title or author
export const searchBooks = async (req: Request, res: Response) => {
  const { title, author } = req.query;
  const query: any = {};
  if (title) query.title = { $regex: title, $options: "i" };
  if (author) query.author = { $regex: author, $options: "i" };
  const books = await Book.find(query);
  res.status(200).json({ books });
};

// Borrow a book
export const borrowBook = async (req: any, res: Response) => {
  const book = await Book.findById(req.body.id);
  if (!book || !book.available) {
    return res.status(400).json({ message: "Book not available" });
  }


  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  book.available = false;
  await book.save();

  user.issuedBooks.push(book._id);
  await user.save({validateBeforeSave:false});

  res.status(200).json({ message: "Book borrowed successfully" });
};

// Return a book
export const returnBook = async (req: any, res: Response) => {
  const book = await Book.findById(req.body.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const index = user.issuedBooks.indexOf(book._id);
  if (index === -1) {
    return res.status(400).json({ message: "Book not issued to user" });
  }

  user.issuedBooks.splice(index, 1);
  await user.save();

  book.available = true;
  await book.save();

  res.status(200).json({ message: "Book returned successfully" });
};

