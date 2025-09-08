import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [userBooks ,setUserBooks] =useState([])
  let [refresh,setRefresh] =useState(0)
  const navigate  =useNavigate()
  const onBorrow = async (bookId: string) => {
     try {
      const res = await axios.put(`${BACKEND_URL}/book/borrow`,{id:bookId},{withCredentials:true});
      setBooks(res.data.books);
     setRefresh(prev=>prev+1)
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const onReturn = async (bookId: string) => {
     try {
      const res = await axios.put(`${BACKEND_URL}/book/return`,{id:bookId},{withCredentials:true});
      setBooks(res.data.books);
     setRefresh(prev=>prev+1)
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };
  const fetchUser =async()=>{
      try {
        const res = await axios.get(`${BACKEND_URL}/user/me`,{withCredentials:true});
        
      setUserBooks(res.data.user.issuedBooks)
      } catch (error) {
        navigate("/Signin")
      }
      
  }
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/book`,{withCredentials:true});
      
      
      setBooks(res.data.books);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  useEffect(() => {
    fetchUser()
    fetchBooks();
  }, [refresh]);

  
  const filteredBooks = books?.filter((book:any) =>
    `${book.title} ${book.author}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 to-white px-6 py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-700">📚 Library Portal</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Browse, borrow, and manage your books effortlessly.
        </p>
      </header>

      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <section>
        {filteredBooks?.length > 0 ? (
          <Card books={filteredBooks} onBorrow={onBorrow} onReturn={onReturn} userBorrowedBooks={userBooks}/>
        ) : (
          <p className="text-center text-gray-500">
            No books match your search.
          </p>
        )}
      </section>

      <footer className="mt-12 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Library Management System. Built by
        Atul Sharma.
      </footer>
    </div>
  );
}
