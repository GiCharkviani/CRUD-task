// Modules & Config
const express = require('express');
require('dotenv').config();
const writeImage = require('./middlewares/img');
const bodyParser = require('body-parser');

// start!
const app = express();

// Imports
const logger = require('./logger');
const companies = require('./routes/companies');
const users = require('./routes/users');

// env
const { PORT } = process.env;

// necessary headers for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// write image
app.use(['*.png', '*.jpg', '*.jpeg', '*.svg'], writeImage);

// middlewares
app.use(bodyParser.json({ limit: '50mb' }));

// routing
app.use(...companies);
app.use(...users);

// Global error handling
app.use((error, req, res, next) => {
  const { statusCode, message, data } = error;
  res.status(statusCode).json({
    message,
    data,
  });
});

app.use('*', (req, res) => {
  res.sendStatus(405);
});

app.listen(PORT, () => {
  logger.log(`Example app listening at http://localhost:${PORT}`);
});
