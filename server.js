const express = require('express');
const fs = require('fs-extra');

const app = express();
const PORT = 3000;

app.use(express.json());

const dataPath = 'books.json';

// GET all books
app.get('/api/books', (req, res) => {
  const booksData = fs.readJsonSync(dataPath);
  res.json(booksData.book);
});

// GET book by ID
app.get('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const booksData = fs.readJsonSync(dataPath);
  const book = booksData.book.find(b => b.id === parseInt(id));
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// POST a new book
app.post('/api/books', (req, res) => {
  const newBook = req.body;
  const booksData = fs.readJsonSync(dataPath);
  newBook.id = booksData.book.length + 1;
  booksData.book.push(newBook);
  fs.writeJsonSync(dataPath, booksData);
  res.json({ message: 'Book added successfully', newBook });
});

// PUT update a book by ID
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const updatedBook = req.body;
  const booksData = fs.readJsonSync(dataPath);
  const bookIndex = booksData.book.findIndex(b => b.id === parseInt(id));
  if (bookIndex !== -1) {
    booksData.book[bookIndex] = { ...booksData.book[bookIndex], ...updatedBook };
    fs.writeJsonSync(dataPath, booksData);
    res.json({ message: 'Book updated successfully', updatedBook });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// DELETE a book by ID
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const booksData = fs.readJsonSync(dataPath);
  const filteredBooks = booksData.book.filter(b => b.id !== parseInt(id));
  if (filteredBooks.length < booksData.book.length) {
    booksData.book = filteredBooks;
    fs.writeJsonSync(dataPath, booksData);
    res.json({ message: 'Book deleted successfully' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
