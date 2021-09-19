const express = require('express');
const app = express();
const path = require("path")

// View Engine Setup & Tools
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const routerArray = require("./router/index");
routerArray.forEach(({ name, path }) => {
    switch (name) {
        // for custom middlewares
        // case "/login": app.use(name, redirect, require(path)); break;
        // case "/logout": app.use(name, require(path)); break;
        default: app.use(name, require(path)); break;
    }
});

// error handler
app.use((req, res) => res.redirect("/"));

const { NODE_ENV } = process.env;
const PORT = process.env.PORT || 2224;
app.listen(PORT, () => {
    console.log(`Running on ${NODE_ENV} mode at port ${PORT}`);
})