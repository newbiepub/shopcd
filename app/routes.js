const db = require("./db"),
    url = require('url'),
    qs = require('querystring'),
    bodyParser = require("body-parser"),
    helmet = require('helmet'),
    cookieParser = require("cookie-parser"),
    User = require("./class/user"),
    faker = require("faker"),
    _ = require("lodash");
var JwtStrategy = require('passport-jwt').Strategy,
    LocalStrategy = require('passport-local').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    passport = require('passport'),
    passwordSalt = require('password-hash-and-salt'),
    jsonwebtoken = require('jsonwebtoken');
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

    // ---------- CD --------------//
    /**
     * Get All CD from database
     */
    app.get('/cd', (req, res) => {
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

    /**
     * FindAll CD
     */

    app.get("/cd/findAll", (req, res) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        db.get("CD", (err, data) => {
            if (!err && data) {
                data = JSON.parse(data);
                let results = _.filter(data, _.omit(req.query, ["limit", "skip"]));
                if (req.query.limit != undefined) {
                    results = results.splice(0, req.query.limit);
                }
                res.end(results.length ? JSON.stringify(results) : "[]");
            }
        })
    });

    /**
     * FindOne CD
     */
    app.get("/cd/findOne", (req, res) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        db.get("CD", (err, data) => {
            if (!err && data != undefined) {
                data = JSON.parse(data);
                let result = _.find(data, req.query);
                res.end(result != undefined ? JSON.stringify(result) : "{}");
            }
        })
    });

    /**
     * CD/DVD Count
     */
    app.get("/cd/count", (req, res) => {
        db.get("CD", (err, data) => {
            data = JSON.parse(data);
            if (!err) {
                res.end(`${data.length}`);
            }
            res.end('0');
        })
    });
    // ---------- CD -------------- //

    // ----------- User -----------//

    /**
     * Authenticate User
     */
    const secret = '8x9jhxt"9(h1n2i3m4';
    let jwtOptions = {};
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
    jwtOptions.secretOrKey = secret;

    passport.use("shopcd-jwt", new JwtStrategy(jwtOptions, (jwt_payload, done) => {
        db.get("User", (err, users) => {
            users = JSON.parse(users);
            if (!err && users.length) {
                let currentUser = users.find(user => user.id === jwt_payload.id);
                if (currentUser) {
                    done(null, _.omit(currentUser, "password"));
                } else {
                    done("Not Found");
                }
            }
        })
    }));
    passport.use("shopcd-local", new LocalStrategy((username, password, done) => {
        db.get("User", (err, users) => {
            users = JSON.parse(users);
            if (!err && users.length) {
                let currentUser = users.find(item => item.username === username);
                if (currentUser) {
                    passwordSalt(password).verifyAgainst(currentUser.password, (err, verified) => {
                        if (err) {
                            done(err);
                        }
                        if (verified) {
                            done(null, _.pick(currentUser, "id"));
                        } else {
                            done("Unauthorized");
                        }
                    })
                } else {
                    done("User not found");
                }
            }
        })
    }));
    app.post("/login", (req, res, next) => {
        passport.authenticate("shopcd-local", (err, userId) => {
            if (err) {
                next(err)
            }
            if (!userId) {
                return res.end(JSON.stringify(new Error(401, "Invalid Credential")));
            } else {
                var token = jsonwebtoken.sign(userId, secret);
                return res.end(JSON.stringify({token: token}));
            }
        })(req, res, next)
    });

    app.get("/user/authorized", (req, res, next) => {
        passport.authenticate("shopcd-jwt", (err, user) => {
            if (err) {
                next(err);
            }
            if (!user) {
                return res.end(JSON.stringify(new Error(401, "Not Found")));
            } else {
                return res.end(JSON.stringify(user));
            }
        })(req, res, next);
    });

    app.post("/signup", (req, res, next) => {
        db.get("User", (err, users) => {
            users = JSON.parse(users);
            if (!err) {
                if (_.find(users, {username: req.body.username})) {
                    res.end(JSON.stringify({err: "username existed"}));
                } else {
                    db.get("Roles", (err, roles) => {
                        roles = JSON.parse(roles);
                        if (!err && roles.length) {
                            let userRole = roles.find(role => role.role === "user");
                            passwordSalt(req.body.password).hash((err, hash) => {
                                let newUser = new User({
                                    id: faker.random.uuid(),
                                    username: req.body.username,
                                    password: hash,
                                    profile: {
                                        picture: faker.image.avatar()
                                    },
                                    role: userRole.id
                                })
                                users.push(newUser);
                                db.put("User", JSON.stringify(users), (err) => console.log(err));
                                res.end(JSON.stringify({success: "success"}));
                            });
                        }
                    });
                }
            }
        })
    });

    app.get("/user/count", (req, res, next) => {
        db.get("User", (err, users) => {
            users = JSON.parse(users);
            if (!err) {
                res.end(`${users.length}`);
            }
            res.end('0');
        })
    });

    // ----------- User -----------//

    app.use((req, res, next) => {
        next("Not Found");
    });
    return app;
};