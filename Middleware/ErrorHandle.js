const { constants } = require("../Constants/errcodes");

const errorHandle = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  console.log("Status Code:", statusCode);
  switch (statusCode) {
    case constants.VALIDATION_ERR:
      res.json({
        title: "Validation Error",
        message: err.message,
        code: res.statusCode,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        code: res.statusCode,
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        title: "UnAuthorized",
        message: err.message,
        code: res.statusCode,
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        code: res.statusCode,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: "Server Error",
        message: err.message,
        code: res.statusCode,
      });
      break;
    default:
      console.log("No Error");
      break;
  }
};

module.exports = errorHandle;
