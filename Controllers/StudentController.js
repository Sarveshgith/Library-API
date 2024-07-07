const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../Models/StudentModel");
const Book = require("../Models/BookModel");
const { errHandle } = require("../Middleware/errHandle");
const DefinedError = require("../Middleware/DefinedError");

const RegisterUser = async (req, res) => {
  try {
    const { regno, password, name } = req.body;

    if (!regno || !password || !name) {
      throw new DefinedError(
        400,
        "error",
        "User Not Added",
        "User Not Registered"
      );
    }

    const UserExists = await Student.findOne({ regno });

    if (UserExists) {
      throw new DefinedError(
        404,
        "error",
        "User Not Found",
        "User Not Registered"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = await Student.create({
      regno,
      password: hashedPassword,
      name,
    });

    if (user) {
      return res.status(201).json(user);
    }
  } catch (err) {
    errHandle(err, err instanceof DefinedError, "User Not Registered", res);
  }
};

const LoginUser = async (req, res) => {
  try {
    const { regno, password } = req.body;

    if (!regno || !password) {
      throw new DefinedError(
        400,
        "error",
        "Missing Fields",
        "User Cannot Login"
      );
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

      return res.status(200).json({ accessToken });
    } else {
      throw new DefinedError(
        401,
        "error",
        "Invalid Credantials",
        "User Cannot Login"
      );
    }
  } catch (err) {
    errHandle(err, err instanceof DefinedError, "User Cannot Login", res);
  }
};

const GetBooks = async (req, res) => {
  try {
    const book = await Book.find();
    return res.status(200).json(book);
  } catch (err) {
    errHandle(err, err instanceof DefinedError, "Book Cannot Retrieved", res);
  }
};

// /api/books?title=Harry%20Potter&author=J.K.Rowling
const GetBook = async (req, res) => {
  const { title, author } = req.query;

  try {
    const query = {};
    if (title) query.title = new RegExp(title, "i");
    if (author) query.author = new RegExp(author, "i");

    const book = await Book.find({
      $or: [{ title: query.title }, { author: query.author }],
    });
    return res.status(200).json(book);
  } catch (error) {
    errHandle(
      error,
      error instanceof DefinedError,
      "Book Cannot Retrieved",
      res
    );
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
  GetBooks,
  GetBook,
};
