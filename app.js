const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const color = require('colors');
const logger = require('./middleware/logger');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const areas = require('./routes/areas');
const auth = require('./routes/auth');
const users = require('./routes/users');
dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());

app.use(cors());

app.use(helmet());
app.use(xssClean());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests',
  },
});

app.use(limiter);
app.use(hpp());

app.use(logger);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/*
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
*/
app.use(express.static('client/apidoc'));
app.get('/api/v1/apidoc', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'client', 'apidoc', 'apidoc.html'));
});

app.use('/api/v1/areas', areas);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});

module.exports = app;
