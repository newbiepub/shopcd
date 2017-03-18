const db = require("./db"),
    url = require('url'),
    qs = require('querystring'),
    bodyParser = require("body-parser"),
    helmet = require('helmet'),
    cookieParser = require("cookie-parser");
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
        res.end(JSON.stringify({lam: "Nguyen Hong Lam", nguyen: "456"}));
    });
    app.get('/allcd', (req, res) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        if(req.query.search != undefined && req.query.search !== "") {

        } else {
            db.get("CD", (err, value) => {
                if (!err && value != undefined) {
                    res.end(value);
                }
            })
        }
    });
    app.use((req, res, next) => {
        next("Not Found");
    });
    return app;
};