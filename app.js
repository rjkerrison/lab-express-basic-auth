// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

app.use(express.static("public"));

// 👇 Start handling routes here
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/others", require("./routes/others.routes"));
app.use("/readUsers", require("./routes/readUsers.routes"));

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
