const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../Models/AdminModel");
const Book = require("../Models/BookModel");
const Student = require("../Models/StudentModel");
const DefinedError = require("../Middleware/DefinedError");
const { errHandle } = require("../Middleware/errHandle");

const RegisterUser = async (req, res) => {
  try {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
      throw new DefinedError(
        400,
        "error",
        "Please Add All Fields",
        "Admin Not Registered"
      );
    }

    const UserExists = await Admin.findOne({ username });

    if (UserExists) {
      throw new DefinedError(
        404,
        "error",
        "Admin Already Exists",
        "Admin Not Registered"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const user = await Admin.create({
      username,
      password: hashedPassword,
      name,
    });

    if (user) {
      return res.status(201).json({
        _id: user.id,
        username: user.username,
        role: user.role,
      });
    }
  } catch (err) {
    errHandle(
      err,
      err instanceof DefinedError,
      "Failed to register admin",
      res
    );
  }
};

const LoginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new DefinedError(
        400,
        "error",
        "Please Add All Fields",
        "Cannot Login"
      );
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

      return res.status(200).json({ accessToken });
    }
    throw new DefinedError(
      401,
      "error",
      "Invalid Credantials",
      "Admin Not Registered"
    );
  } catch (err) {
    errHandle(err, err instanceof DefinedError, "Failed to Login", res);
  }
};

const GetBooks = async (req, res) => {
  try {
    const book = await Book.find();
    return res.status(200).json(book);
  } catch (err) {
    errHandle(err, err instanceof DefinedError, "Failed to Get Books", res);
  }
};

const GetStudents = async (req, res) => {
  try {
    const student = await Student.find();
    res.status(200).json(student);
  } catch (err) {
    errHandle(err, err instanceof DefinedError, "Failed to Get Students", res);
  }
};

const UpdateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      throw new DefinedError(
        404,
        "error",
        "Student Not Found",
        "Student Not Updated"
      );
    }

    const update = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(200).json(update);
  } catch (err) {
    errHandle(
      err,
      err instanceof DefinedError,
      "Failed to Update Student",
      res
    );
  }
};

const DelStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      throw new DefinedError(
        404,
        "error",
        "Student Not Found",
        "Student Not Deleted"
      );
    }

    await Student.deleteOne({ _id: req.params.id });
    return res.status(200).json(student);
  } catch (err) {
    errHandle(
      err,
      err instanceof DefinedError,
      "Failed to Delete Student",
      res
    );
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
  GetBooks,
  GetStudents,
  UpdateStudent,
  DelStudent,
};
