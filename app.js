var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const DAL = require('./dataAccessLayer');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT;
DAL.Connect();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
require('dotenv').config();
var cors = require('cors');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// app.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next()
// });

app.get('/api/waterFilters', cors(), async function(req, res) {
  // const result = Object.values(products);
  const result = await DAL.Find();

  res.send(result);
});

app.get('/api/waterFilters/:id', cors(), async function(req, res) {
  const id = req.params.id;
  
  const product = {
      _id: ObjectId(id)
  };

  const result = await DAL.Find(product);

  if (result) {
      res.send(result);
  }
  else {
      res.send('No product with ID: ' + id + ' found!');
  }
});

app.post('/api/waterFilters', cors(), async function(req, res) {
  const product = req.body;
  console.log('incoming request', product);
  
  if (product.name && product.price && product.type && product.URL) {
      const result = await DAL.Insert(product);

      res.send('Successfully created a product!');
  }
  else {
      res.send('Fail');
  }
});

app.put('/api/waterFilters/:id', cors(), async function(req, res) {
  const id = req.params.id;
  const product = {
      _id: ObjectId(id)
  };
  const newProduct = req.body;
  const updatedProduct = { $set: newProduct};
  const result = await DAL.Update(product, updatedProduct);
      res.send(result);
});

app.delete('/api/waterFilters/:id', cors(), async function(req, res) {
  const id = req.params.id;
  const product = {
      _id: ObjectId(id)
  };
  const result = await DAL.Remove(product);
  
  // delete products[id];

  res.send(result);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
