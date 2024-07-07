const { errHandle } = require("./errHandle");
const DefinedError = require("./DefinedError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof DefinedError) {
    return errHandle(err, true, err.message, res);
  }
  errHandle(err, false, "An unexpected error occurred.", res);
};

module.exports = errorHandler;
