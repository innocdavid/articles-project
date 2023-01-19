// modules required
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Articles = require("./models/articles");
const bodyParser = require("body-parser");

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

// middleware
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }))

// set public folder static
app.use(express.static(path.join(__dirname, "public")));


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

// get added articles
app.get("/articles/add", (req, res) => {
    res.render("add_article", {
        title: "Add Articles"
    });
});

// post articles
app.post('/articles/add', (req, res) => {
    let articles = new Articles();
    articles.title = req.body.title;
    articles.author = req.body.author;
    articles.body = req.body.body;

    articles.save((err) => {
        if (err) return console.log(err.message);
        res.redirect('/')
    });
});


// server
app.listen(3000, () => {
    console.log("server started on port 3000");
})