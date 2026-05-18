const express = require('express');
const cors = require('cors');
const {engine} = require('express-handlebars');
const {join} = require("node:path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));


module.exports = app;