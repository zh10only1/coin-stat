const express = require('express');
const dbConnect = require('./database/connection');
const router = require('./routes/index')
const {PORT} = require('./config/environment');
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser');
const cors = require('cors');

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000']
}

const app = express();
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(router);

dbConnect();

app.use('/storage', express.static('storage'));

app.use(errorHandler);
app.listen(PORT,console.log(`Backend is running on Port: ${PORT}`));




