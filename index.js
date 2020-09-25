//declarations

const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose');
dotenv.config();

//Database Connection
mongoose.connect(
    process.env.DB_CONNECT,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log("connected!")
);

//Import Routes
const authRoute = require('./routes/auth');



//Middleware
app.use(express.json());
//Route Middleware
app.use('/api/user', authRoute)



app.listen(3000, () => console.log("Running on port 3000"))
