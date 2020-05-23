// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Express to run server and routes
var path = require('path');
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
/* Middleware*/
const bodyParser = require('body-parser');
// configuring express to use body-parser as middle-ware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// CORS for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

const port = 3000;
// Spin up the server
const server = app.listen(port, listening);
// Callback to debug
function listening() {
  console.log(`server running on localhost: ${port}`);
}

app.get('/', function (req, res) {
  res.sendFile('dist/index.html')
});
