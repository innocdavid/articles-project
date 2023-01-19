// modules required
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Articles = require("./models/articles");

// db configuration
mongoose.connect("mongodb://127.0.0.1:27017/nodekb");
let db = mongoose.connection;
// check db connection
db.once("open", () => {
    console.log("connected to mongodb");
})
// check for db errors
db.on("error", (err) => {
    console.log(err.message)
})

// init App
const app = express();

// load view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// home route
app.get("/", (req, res) => {
    Articles.find({}, (err, articles) => {
        if (err) console.log(err.message);
        res.render("index", {
            title: "Articles",
            articles: articles
        });
    });
});

// add articles
app.get("/articles/add", (req, res) => {
    res.render("add_article", {
        title: "Add Articles"
    });
});

// server
app.listen(3000, () => {
    console.log("server started on port 3000");
})