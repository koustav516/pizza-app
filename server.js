const express = require("express");
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts')
const path = require('path');

const initRoutes = require('./routes/web');

const app = express();

const PORT = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'));

app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.use(initRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
