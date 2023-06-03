const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
dotenv.config();

// routes
const wordsRoute = require("./routes/words");

//middleware
app.use(express.json());
app.use(morgan("common"));
app.use(helmet());

// app.use("/users", userRoute);
app.use("/server/words", wordsRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});