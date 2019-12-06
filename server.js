const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Routes Import
const users = require('./routes/auth');

const app = express();

//BodyParser Middleware
app.use(bodyParser.json());

//Config to DB
const db = require('./config/default').mongoURI;

//Connect to Mongo DB
mongoose
    .connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Mongo DB Connected...'))
    .catch(err => console.log(err));

//Middleware Route
app.use('/api/users', users);
//Listen Server
const port = process.env.PORT || 5000;
app.listen(port,() => console.log(`Server Up on ${port}`));