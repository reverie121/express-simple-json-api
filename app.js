/** Demo app for routing. */

const express = require('express');
const app = express();
const itemsRoutes = require('./itemsRoutes');
const ExpressError = require('./expressError');

app.use(express.json());

app.use('/items', itemsRoutes);



// 404 handler
app.use(function (request, response, next) {
  const notFoundError = new ExpressError("Not Found", 404);
  return next(notFoundError)
});

// generic error handler
app.use(function(error, request, response, next) {
  // the default status is 500 Internal Server Error
  let status = error.status || 500;
  let message = error.message;

  // set the status and alert the user
  return response.status(status).json({
    error: {message, status}
  });
});
// end generic handler

module.exports = app