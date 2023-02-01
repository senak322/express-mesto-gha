class CreateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CreateError';
    this.statusCode = 400;
  }
}

module.exports = { CreateError };
