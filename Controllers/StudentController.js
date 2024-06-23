const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../Models/StudentModel");
const Book = require("../Models/BookModel");

const RegisterUser = AsyncHandler(async (req, res) => {
  const { regno, password, name } = req.body;

  if (!regno || !password || !name) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const UserExists = await Student.findOne({ regno });

  if (UserExists) {
    res.status(404);
    throw new Error("User already Exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  const user = Student.create({
    regno,
    password: hashedPassword,
    name,
  });

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(500);
    throw new Error("User not created");
  }
});

const LoginUser = AsyncHandler(async (req, res) => {
  const { regno, password } = req.body;

  if (!regno || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const user = await Student.findOne({ regno });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          id: user.id,
          name: user.name,
          regno: user.regno,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Invalid Credentials");
  }
});

const GetBooks = AsyncHandler(async (req, res) => {
  const book = await Book.find();
  res.status(200).json(book);
});
// /api/books?title=Harry%20Potter&author=J.K.Rowling
const GetBook = AsyncHandler(async (req, res) => {
  const { title, author } = req.query;

  try {
    const query = {};
    if (title) query.title = new RegExp(title, "i");
    if (author) query.author = new RegExp(author, "i");

    const book = await Book.find({
      $or: [{ title: query.title }, { author: query.author }],
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(500);
    throw new Error("Error while Finding!");
  }
});

module.exports = {
  RegisterUser,
  LoginUser,
  GetBooks,
  GetBook,
};
