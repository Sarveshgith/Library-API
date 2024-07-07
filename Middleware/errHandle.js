const errHandle = (err, isDefinedError, msg, res) => {
  if (isDefinedError) {
    const code = err.statusCode;
    return res.status(code).json({
      status: err.status,
      message: err.message,
      data: err.data.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: msg,
    data: "Internal Server Error",
  });
};

module.exports = { errHandle };
