var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
const bodyparser = require("body-parser");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.get("/postapi", bodyparser.urlencoded({ extended: false }), (req, res) => {
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*"
    });
    res.end(
        JSON.stringify({
            code: 1,
            type: "post"
        })
    );
});

app.get("/api", (req, res) => {
    const oUrl = url.parse(req.url);
    const oQuery = querystring.parse(oUrl.query);

    if (oQuery.callback) {
        res.writeHead(200, {
            "Content-Type": "text/javascript"
        });
        const jsonp = { code: 1 };
        res.end(oQuery.callback + "(" + JSON.stringify(jsonp) + ")");
    } else {
        const json = {
            code: 1
        };
        res.end(JSON.stringify(json));
    }
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
