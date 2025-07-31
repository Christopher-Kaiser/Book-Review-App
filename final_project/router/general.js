const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(404).json({message: "Unable to register user. Username and password are required."});
  }
  
  // Check if the user already exists
  if (users.find(user => user.username === username)) {
    return res.status(404).json({message: "User already exists!"});
  }
  
  // Add the new user to the users array
  users.push({"username": username, "password": password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  // Check if the book exists with the given ISBN
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 2));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = {};
  
  // Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);
  
  // Iterate through the 'books' array & check the author matches
  for (let key of bookKeys) {
    if (books[key].author === author) {
      booksByAuthor[key] = books[key];
    }
  }
  
  // Check if any books were found
  if (Object.keys(booksByAuthor).length > 0) {
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 2));
  } else {
    return res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = {};
  
  // Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);
  
  // Iterate through the 'books' array & check the title matches
  for (let key of bookKeys) {
    if (books[key].title === title) {
      booksByTitle[key] = books[key];
    }
  }
  
  // Check if any books were found
  if (Object.keys(booksByTitle).length > 0) {
    return res.status(200).send(JSON.stringify(booksByTitle, null, 2));
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  // Check if the book exists with the given ISBN
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 2));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
