const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => res.json({msg: 'Hello Program!!!'}))

app.listen(PORT,console.log(`Backend is running on Port: ${PORT}`))




