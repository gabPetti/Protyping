const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");

const app = express();

mongoose.set("strictQuery", true);
mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('connected to MongoDB')).catch(err => console.log(err));

// routes
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const wordsRoute = require("./routes/words");

//middleware
app.use(express.json());
app.use(morgan("common"));
app.use(helmet());

app.use("/server/auth", authRoute);
app.use("/server/users", usersRoute);
app.use("/server/words", wordsRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});
