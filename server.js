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

// load a get a single article page
app.get("/article/:id", (req, res) => {
    Articles.findById(req.params.id, (err, article) => {
        res.render("single_article", {
            article: article
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
app.post("/articles/add", (req, res) => {
    let article = new Articles();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save((err) => {
        if (err) return console.log(err.message);
        res.redirect('/')
    });
});

// load edit article form
app.get("/article/edit/:id", (req, res) => {
    Articles.findById(req.params.id, (err, article) => {
        res.render("edit_article", {
            title: "Edit Article",
            article: article
        });
    });
});

// update an article
app.post("/article/edit/:id", (req, res) => {
    let article = {}
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id: req.params.id}
    Articles.updateOne(query, article, (err) => {
        if (err) return console.log(err.message);
        res.redirect('/')
    });
});

app.delete('/article/:id', (req, res) => {
    let query = {_id: req.params.id};
    Articles.remove(query, (err) => {
        if(err) console.log(err.message);
        res.send("Success")
    })
});

// server
app.listen(3000, () => {
    console.log("server started on port 3000");
});