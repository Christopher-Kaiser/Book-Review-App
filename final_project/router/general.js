const express = require('express');
const axios = require('axios');
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

// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    // Simulate an async operation using Promise and setTimeout
    const booksList = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 100);
    });
    
    return res.status(200).send(JSON.stringify(booksList, null, 2));
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    // Simulate an async operation using Promise and setTimeout
    const bookDetails = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error('Book not found'));
        }
      }, 100);
    });
    
    return res.status(200).send(JSON.stringify(bookDetails, null, 2));
  } catch (error) {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    // Simulate an async operation using Promise and setTimeout
    const booksByAuthor = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = {};
        const bookKeys = Object.keys(books);
        
        // Iterate through the 'books' array & check the author matches
        for (let key of bookKeys) {
          if (books[key].author === author) {
            result[key] = books[key];
          }
        }
        
        if (Object.keys(result).length > 0) {
          resolve(result);
        } else {
          reject(new Error('No books found for this author'));
        }
      }, 100);
    });
    
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 2));
  } catch (error) {
    return res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title using async-await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  
  try {
    // Simulate an async operation using Promise and setTimeout
    const booksByTitle = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const result = {};
        const bookKeys = Object.keys(books);
        
        // Iterate through the 'books' array & check the title matches
        for (let key of bookKeys) {
          if (books[key].title === title) {
            result[key] = books[key];
          }
        }
        
        if (Object.keys(result).length > 0) {
          resolve(result);
        } else {
          reject(new Error('No books found with this title'));
        }
      }, 100);
    });
    
    return res.status(200).send(JSON.stringify(booksByTitle, null, 2));
  } catch (error) {
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
