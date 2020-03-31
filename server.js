const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRouter = require('./routes/api');
const path =  require('path');

// Config and app init
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json());

// Database connection
const host = process.env.MONGODB_URI;
mongoose.connect(host, {useNewUrlParser: true, useCreateIndex: true});

const connection = mongoose.connection;
connection.on('open', () => { console.log(' > Database connected') });
 
// Routingt to api
app.use('/api', apiRouter);

// Routing to static client for production
if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Server start
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`\n > Server running on :${port}`);
}); 