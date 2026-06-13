const mongoose = require('mongoose');

const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((error) => error.message).join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(err.keyValue).join(', ');
    message = `${duplicateField} already exists`; 
  }

  if (err instanceof mongoose.Error.CastError && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid user ID format';
  }

  res.status(statusCode).json({ success: false, message });
};

module.exports = { notFound, errorHandler };
