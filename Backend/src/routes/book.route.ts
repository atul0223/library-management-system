import express from "express";
import {
  addBook,
  getAvailableBooks,
  searchBooks,
  borrowBook,
  returnBook
} from "../controllers/book.controller";

import  verifyUser from "../middleware/auth.middleware";
import {verifyAdmin}  from "../middleware/verifyAdmin.middleware";

const router = express.Router();

// Add a new book (Admin only)
router.post("/", verifyUser, verifyAdmin, addBook);

// Get all available books
router.get("/", getAvailableBooks);

// Search books by title or author
router.get("/search", searchBooks);

// Borrow a book
router.put("/borrow", verifyUser, borrowBook);

// Return a book
router.put("/return", verifyUser, returnBook);

export default router;