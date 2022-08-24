// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

// authentification routes
const auth = require('./routes/auth.routes');
app.use('/auth', auth);
// protected routes
const { isAuthenticated } = require('./middleware/jwt.middleware');
const protected = require('./routes/protected.routes');
app.use('/', isAuthenticated, protected);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
