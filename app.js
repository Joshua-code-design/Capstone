require("dotenv").config();
const path = require("path");
const express = require("express"); 
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const connection = require("./model/database");
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "default"));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "files")));

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET, // Change this to a strong, random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

//database connection
connection();

// Import routes
app.use("/", routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//hosted
// app.listen(PORT, '0.0.0.0',() => {
//     console.log(`Server is running`);
// });


// To do:

// Frontend:
// Fix modal data on all 3 Youth, senior and PWD

// Fix Osca table, View Modal does not work

// Change in Super admin Edit button in Users to show details of Users and the option to  Edit details

// Backend:
// Display data on modal dynamically on all 3 tables

// Make Edit and Delete users

// make edit data on all 3 tables

// Add Unique ID on Different data all 3 tables

// Display the Analytics Dynamically on admin




