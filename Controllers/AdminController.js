const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../Models/AdminModel");
const Book = require("../Models/BookModel");
const Student = require("../Models/StudentModel");

const RegisterUser = async (req, res) => {
  try {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
      res.status(404);
      throw new Error("Please add all fields");
    }

    const UserExists = await Admin.findOne({ username });

    if (UserExists) {
      res.status(400);
      throw new Error("User already Exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = Admin.create({
      username,
      password: hashedPassword,
      name,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        role: user.role,
      });
    } else {
      res.status(500);
      throw new Error("User not created");
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const LoginUser = AsyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(404);
    throw new Error("Please add all fields");
  }

  const user = await Admin.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
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

const GetStudents = AsyncHandler(async (req, res) => {
  const student = await Student.find();
  res.status(200).json(student);
});

const UpdateStudent = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student Not Found!");
  }

  const update = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(update);
});

const DelStudent = AsyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student Not Found");
  }

  await Student.deleteOne({ _id: req.params.id });
  res.status(200).json(student);
});

module.exports = {
  RegisterUser,
  LoginUser,
  GetBooks,
  GetStudents,
  UpdateStudent,
  DelStudent,
};
