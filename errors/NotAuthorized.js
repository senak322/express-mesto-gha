class NotAuthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'NotAuthorized';
  }
}

module.exports = { NotAuthorized };
