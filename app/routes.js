const db = require("./db"),
    url = require('url'),
    qs = require('querystring'),
    bodyParser = require("body-parser"),
    helmet = require('helmet'),
    cookieParser = require("cookie-parser"),
    _ = require("lodash");
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
module.exports = (app) => {
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(helmet());
    // parse querystring
    app.use((req, res, next) => {
        req.query = qs.parse((url).parse(req.url).query);
        next();
    });
    app.use(cookieParser());

    app.get('/', (req, res) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end("SHOP CD API");
    });
    app.get('/allcd', (req, res) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        db.get("CD", (err, value) => {
            if (!err && value != undefined) {
                let data = JSON.parse(value);
                if (req.query.search != undefined && req.query.search !== "") {
                    let searchString = decodeURIComponent(req.query.search),
                        response = [];
                    _.each(data, (item) => {
                        if (item.title.indexOf(searchString) !== -1 || item.summary.indexOf(searchString) !== -1 || item.description.indexOf(searchString) !== -1) {
                            response.push(item);
                        }
                    });
                    data = response;
                }
                if (req.query.limit != undefined) {
                    data = data.splice(0, req.query.limit);
                }
                res.end(JSON.stringify(data));
            }
        })
    });
    app.use((req, res, next) => {
        next("Not Found");
    });
    return app;
};