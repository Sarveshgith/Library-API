class DefinedError extends Error {
  constructor(statusCode, status, message, data) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.data = data;
  }
}

module.exports = DefinedError;
