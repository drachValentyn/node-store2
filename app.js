const path = require('path');
const express = require('express');
const app = express();
const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const engines = require('consolidate');
const bluebird = require('bluebird');
require('dotenv').config();


const stripe = require('stripe')('sk_test_5mK9ByWUwDyCBDXfoLCdotPa00TbbEKsDz');

stripe.customers.create({
  email: 'valentynd91@gmail.com',
})
  .then(customer => console.log(customer.id))
  .catch(error => console.error(error));

// create route

const mongoose = require('mongoose');
const user = require('./routes/user');
const auth = require('./routes/auth');
const upload = require('./routes/file');
const expFile = require('./routes/export');
// const chart = require('./routes/chart');
const video = require('./routes/video');

// add mongodb
mongoose.Promise = require('bluebird');

mongoose
  .connect('mongodb://localhost/mevn-users', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    promiseLibrary: bluebird,
  })
  .then(() => console.log('connection successful')) // eslint-disable-line no-console
  .catch(err => console.error(err)); // eslint-disable-line no-console


// middleware express
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: 'false' }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', express.static(path.join(__dirname, 'dist')));

// uploads Multer folder
app.use(express.static('./uploads'));

app.use('/users', express.static(path.join(__dirname, 'dist')));
app.use('/user', user);
app.use('/api/auth', auth);
app.use('/uploads', upload);
app.use('/exports', expFile);
// app.use('/charts', chart);
app.use('/video', video);


// if the files size increase more than 500KB
app.use((err, req, res) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(422).json({ error: 'Allowed file size is 500KB' });
    return;
  }
  if (err.code === 'INCORRECT_FILETYPE') {
    res.status(422).json({ error: 'Only image are allowed' });
  }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  // eslint-disable-next-line no-param-reassign
  res.locals.message = err.message;
  // eslint-disable-next-line no-param-reassign
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.engine('html', engines.mustache);
app.set('view engine', 'html');

module.exports = app;
