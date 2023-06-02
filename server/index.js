const express = require("express");
const { getWordsList } = require('most-common-words-by-language');
const app = express();

const dotenv = require("dotenv");
const path = require("path");

// const userRoute = require("./routes/users");
const wordsRoute = require("./routes/words");

dotenv.config();

//middleware
app.use(express.json());

// app.use("/users", userRoute);
app.use("/words", wordsRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});