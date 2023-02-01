class BadReqest extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadReqest';
    this.statusCode = 404;
  }
}

module.exports = { BadReqest };
