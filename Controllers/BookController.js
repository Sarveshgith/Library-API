const AsyncHandler = require("express-async-handler");
const Book = require("../Models/BookModel");

const AddBook = AsyncHandler(async (req, res) => {
  console.log("Created Book: ", req.body);
  const { title, author } = req.body;

  if (!title || !author) {
    res.status(400);
    throw new Error("Fields are Missing!");
  }

  const book = await Book.create(req.body);
  res.status(200).json(book);
});

// /api/book/Harry%20Potter
const DelBook = AsyncHandler(async (req, res) => {
  try {
    const { title } = req.params;
    const book = await Book.findOne({ title });
    if (!book) {
      res.status(404);
      throw new Error("Book not found");
    }
    await Book.deleteOne({ title });
    res.status(200).json(book);
  } catch (error) {
    res.status(404);
    throw new Error("Error Found");
  }
});

module.exports = {
  AddBook,
  DelBook,
};
