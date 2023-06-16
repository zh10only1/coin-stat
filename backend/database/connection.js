const mongoose = require('mongoose');
const {CONNECTION_STRING} = require('../config/environment');

const dbConnection = async () => {
    try {
        const conn = await mongoose.connect(CONNECTION_STRING);
        console.log(`Database connected to host: ${conn.connection.host}`);
    }
    catch (err) {
        console.log(`Error: ${err}`);
    }
}

module.exports = dbConnection;