const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const userRoutes = require("./routes/user");
const movieRoutes = require('./routes/movie');

mongoose.connect(process.env.MONGODB_STRING);
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connnection error"));
db.once("open", ()=> console.log("We're connected to the cloud database"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);

const corsOptions = {
	origin: ['http://localhost:8000'],
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors());

if (require.main == module){
	app.listen(process.env.PORT, () => console.log(`Server is running at port ${process.env.PORT}`));
}

module.exports = {app, mongoose}