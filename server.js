require('dotenv').config();
const express = require("express");
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts')
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const SessionStorage = require('connect-mongo')(session);

const initRoutes = require('./routes/web');

const app = express();
const PORT = process.env.PORT || 3000

//Mongo Connection
const url = 'mongodb://localhost/pizza';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
});

const connection = mongoose.connection;
connection.once('open', ()=>{
  console.log('Database connected');
}).catch(err =>{
  console.log('Connection Failed: ', err);
});

//session store
let mongoSessionStore = new SessionStorage({
      mongooseConnection: connection,
      collection: 'sessions'
});

//Cookie Session config
app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  store: mongoSessionStore,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }  //24 hour
}));

app.use(flash());

//Static file and json allow
app.use(express.static(__dirname + '/public'));
app.use(express.json());

//Global Middlewares
app.use((req,res,next)=>{
  res.locals.session = req.session;
  next();
});

//Set up template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

//Routes
app.use(initRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
