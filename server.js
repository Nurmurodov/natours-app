const mongoose = require('mongoose');
const dotenv = require('dotenv');


process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION. Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

console.log(process.env.DATABASE);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION. Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
