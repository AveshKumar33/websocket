const { createServer } = require("http"); // you can use https as well
const express = require("express");
const socketIo = require("socket.io");
const axios = require('axios');
var bodyParser = require('body-parser');
const { env } = require("process");
//const envFile = 'env/.env.local';
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// console.log("node env",process.env.APP_REQUEST_URL);
const server = createServer(app);
const io = socketIo(server, { cors: { origin: "*" } }); // you can change the cors to your own domain
io.on("connection", socket => {
  console.log("New client connected",process.env.APP_REQUEST_URL);
  socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) })
  socket.on("disconnect", () => console.log("Client disconnected"));
});


app.use((req, res, next) => {
  req.io = io;
  return next();
});

// Now all routes & middleware will have accesss 

app.use("/api", require("./routes/api")); // this file's express.Router() will have the req.io too.

server.listen(2222, () => console.log(`Server started 21 oct!`));


/*******************/
