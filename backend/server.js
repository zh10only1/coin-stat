const express = require('express');
const dbConnect = require('./database/connection');
const router = require('./routes/index')
const {PORT} = require('./config/environment');
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(router);

dbConnect();

app.use('/storage', express.static('storage'));

app.use(errorHandler);
app.listen(PORT,console.log(`Backend is running on Port: ${PORT}`));




