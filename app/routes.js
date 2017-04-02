const db = require("./db"),
    url = require('url'),
    qs = require('querystring'),
    bodyParser = require("body-parser"),
    helmet = require('helmet'),
    cookieParser = require("cookie-parser"),
    User = require("./class/user"),
    Cart = require("./class/cart"),
    CD = require("./class/cd"),
    Category = require("./class/category"),
    Producer = require("./class/producer"),
    faker = require("faker"),
    _ = require("lodash"),
    gateway = require('./class/payment-gateway');
const JwtStrategy = require('passport-jwt').Strategy,
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
     * Insert CD
     */
    app.post("/cd/new", (req, res, next) => {
        db.get("CD", (err, cd) => {
            let data = JSON.parse(cd);
            if (err && !data.length) {
                data = [];
            }
            let newCD = {
                title: faker.lorem.words(),
                summary: faker.lorem.sentences(),
                description: faker.lorem.paragraphs(),
                image: faker.image.image(),
                cost: faker.random.number()
            };
            Object.assign(newCD, req.body);
            let cdData = new CD(newCD);
            data.push(cdData);
            db.put("CD", JSON.stringify(data), (err) => {
                if (err) {
                    res.end(JSON.stringify(err));
                } else {
                    res.end(JSON.stringify({success: true}));
                }
            })
        });
    });

    /**
     * Update CD
     */

    app.put("/cd/update", (req, res, next) => {
        if (req.query.id) {
            db.get("CD", (err, cd) => {
                let data = JSON.parse(cd);
                if (!err && data.length) {
                    let getCD = data.find(item => item.id === req.query.id);
                    if (getCD) {
                        Object.assign(getCD, _.omit(req.body, "id"));
                        data.splice(_.indexOf(data, getCD), 1, getCD);
                        db.put("CD", JSON.stringify(data), err => {
                            if (err) {
                                res.end(JSON.stringify(err));
                            } else {
                                res.end(JSON.stringify({
                                    success: true
                                }));
                            }
                        })
                    } else {
                        res.end("Not Found");
                    }
                } else {
                    res.end(JSON.stringify({
                        success: false
                    }));
                }
            })
        } else {
            res.end("Unauthorized");
        }
    });

    /**
     * Delete CD
     */

    app.post("/cd/delete", (req, res, next) => {
        if (req.body.id) {
            db.get("CD", (err, cd) => {
                let data = JSON.parse(cd);
                if (!err && data.length) {
                    let currentCD = data.find(item => item.id === req.body.id),
                        getIndex = _.indexOf(data, currentCD);
                    if (currentCD) {
                        data.splice(getIndex, 1);
                        db.put("CD", JSON.stringify(data), (err) => {
                            if (err) {
                                res.end(JSON.stringify(err));
                            } else {
                                res.end(JSON.stringify({success: true}))
                            }
                        })
                    } else {
                        res.end("Not Found");
                    }
                } else {
                    res.end("Empty");
                }
            })
        } else {
            req.end("Unauthorized");
        }
    });

    /**
     * Up Vote
     */

    app.post("/cd/upVote", (req, res, next) => {
        if (req.body.id && req.body.userId && req.body.vote) {
            db.get("CD", (err, cd) => {
                let data = JSON.parse(cd);
                if (!err && data.length) {
                    let currentCD = data.find(item => item.id === req.body.id);
                    if (currentCD) {
                        currentCD.vote += parseInt(req.body.vote);
                        currentCD.userVoted++;
                        data.splice(_.indexOf(data, currentCD), 1, currentCD);
                        db.put("CD", JSON.stringify(data), (err) => {
                            if (err) {
                                res.end(JSON.stringify(err));
                            } else {
                                res.end(JSON.stringify({success: true}));
                            }
                        })
                    } else {
                        res.end("Not Found");
                    }
                } else {
                    res.end("Empty");
                }
            })
        } else {
            res.end("Unauthorized");
        }
    });

    /**
     * Get Vote
     */

    app.get("/cd/vote", (req, res, next) => {
        if (req.query.id) {
            db.get("CD", (err, cd) => {
                let data = JSON.parse(cd);
                if (!err && data.length) {
                    let currentCD = data.find(item => item.id === req.query.id);
                    if (currentCD) {
                        res.end(JSON.stringify({vote: parseFloat(currentCD.vote / currentCD.userVoted)}));
                    } else {
                        res.end("Not Found");
                    }
                } else {
                    res.end("Empty");
                }
            })
        } else {
            res.end(JSON.stringify({vote: 0}));
        }
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

    // ------------ Category -----------//
    /**
     * Category count
     */
    app.get("/category/count", (req, res) => {
        db.get("Category", (err, data) => {
            data = JSON.parse(data);
            if (!err) {
                res.end(`${data.length}`);
            }
            res.end('0');
        })
    });

    /**
     * Insert Category
     */
    app.post("/category/new", (req, res, next) => {
        db.get("Category", (err, category) => {
            let data = JSON.parse(category);
            if (err && !data.length) {
                data = [];
            }
            let newCategory = {
                name: faker.lorem.words()
            };
            Object.assign(newCategory, req.body);
            let categoryData = new Category(newCategory);
            data.push(categoryData);
            db.put("Category", JSON.stringify(data), (err) => {
                if (err) {
                    res.end(JSON.stringify(err));
                } else {
                    res.end(JSON.stringify({success: true}));
                }
            })
        });
    });

    /**
     * Update Category
     */
    app.put("/category/update", (req, res, next) => {
        if (req.query.id) {
            db.get("Category", (err, category) => {
                let data = JSON.parse(category);
                if (!err && data.length) {
                    let getCategory = data.find(item => item.id === req.query.id);
                    if (getCategory) {
                        Object.assign(getCategory, _.omit(req.body, "id"));
                        data.splice(_.indexOf(data, getCategory), 1, getCategory);
                        db.put("Category", JSON.stringify(data), err => {
                            if (err) {
                                res.end(JSON.stringify(err));
                            } else {
                                res.end(JSON.stringify({
                                    success: true
                                }));
                            }
                        })
                    } else {
                        res.end("Not Found");
                    }
                } else {
                    res.end(JSON.stringify({
                        success: false
                    }));
                }
            })
        } else {
            res.end("Unauthorized");
        }
    });

    /**
     * Delete Category
     */
    app.post("/category/delete", (req, res, next) => {
        if (req.body.id) {
            db.get("Category", (err, category) => {
                let data = JSON.parse(category);
                if (!err && data.length) {
                    let currentCategory = data.find(item => item.id === req.body.id),
                        getIndex = _.indexOf(data, currentCategory);
                    if (currentCategory) {
                        data.splice(getIndex, 1);
                        db.put("Category", JSON.stringify(data), (err) => {
                            if (err) {
                                res.end(JSON.stringify(err));
                            } else {
                                res.end(JSON.stringify({success: true}))
                            }
                        })
                    } else {
                        res.end("Not Found");
                    }
                } else {
                    res.end("Empty");
                }
            })
        } else {
            req.end("Unauthorized");
        }
    });

    /**
     * Category FindAll
     */

    app.get("/category/findAll", (req, res) => {
        db.get("Category", (err, data) => {
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
     * Category FindOne
     */
    app.get("/category/findOne", (req, res) => {
        db.get("Category", (err, data) => {
            if (!err && data != undefined) {
                data = JSON.parse(data);
                let result = _.find(data, req.query);
                res.end(result != undefined ? JSON.stringify(result) : "{}");
            }
        })
    });

    app.get("/category", (req, res) => {
        db.get("Category", (err, value) => {
            if (!err && value != undefined) {
                let data = JSON.parse(value);
                if (!err) {
                    if (req.query.limit != undefined) {
                        data = data.splice(0, req.query.limit);
                    }
                    res.end(data.length ? JSON.stringify(data) : "[]");
                } else {
                    res.end("No Data");
                }
            }
        })
    });

    // ------------ Category -----------//

    // ------------ Producer ------------- //

    /**
     * Producer count
     */
    app.get("/producer/count", (req, res) => {
        db.get("Producer", (err, data) => {
            data = JSON.parse(data);
            if (!err) {
                res.end(`${data.length}`);
            }
            res.end('0');
        })
    });

    /**
     * Insert Category
     */
    app.post("/producer/new", (req, res, next) => {
        db.get("Producer", (err, producer) => {
            let data = JSON.parse(producer);
            if (err && !data.length) {
                data = [];
            }
            let newProducer = {
                producerName: faker.company.companyName
            };
            Object.assign(newProducer, req.body);
            let producerData = new Producer(newProducer);
            data.push(producerData);
            db.put("Producer", JSON.stringify(data), (err) => {
                if (err) {
                    res.end(JSON.stringify(err));
                } else {
                    res.end(JSON.stringify({success: true}));
                }
            })
        });
    });

    /**
     * Update Category
     */
    app.put("/producer/update", (req, res, next) => {
        if (req.query.id) {
            db.get("Producer", (err, producer) => {
                let data = JSON.parse(producer);
                if (!err && data.length) {
                    let getProducer = data.find(item => item.id === req.query.id);
                    if (getProducer) {
                        Object.assign(getProducer, _.omit(req.body, "id"));
                        data.splice(_.indexOf(data, getProducer), 1, getProducer);
                        db.put("Producer", JSON.stringify(data), err => {
                            if (err) {
                                res.end(JSON.stringify(err));
                            } else {
                                res.end(JSON.stringify({
                                    success: true
                                }));
                            }
                        })
                    } else {
                        res.end("Not Found");
                    }
                } else {
                    res.end(JSON.stringify({
                        success: false
                    }));
                }
            })
        } else {
            res.end("Unauthorized");
        }
    });

    /**
     * Delete Category
     */
    app.post("/producer/delete", (req, res, next) => {
        if (req.body.id) {
            db.get("Producer", (err, category) => {
                let data = JSON.parse(category);
                if (!err && data.length) {
                    let currentProducer = data.find(item => item.id === req.body.id),
                        getIndex = _.indexOf(data, currentProducer);
                    if (currentProducer) {
                        data.splice(getIndex, 1);
                        db.put("Producer", JSON.stringify(data), (err) => {
                            if (err) {
                                res.end(JSON.stringify(err));
                            } else {
                                res.end(JSON.stringify({success: true}))
                            }
                        })
                    } else {
                        res.end("Not Found");
                    }
                } else {
                    res.end("Empty");
                }
            })
        } else {
            req.end("Unauthorized");
        }
    });

    /**
     * Producer FindAll
     */

    app.get("/producer/findAll", (req, res) => {
        db.get("Producer", (err, data) => {
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
     * Producer FindOne
     */
    app.get("/producer/findOne", (req, res) => {
        db.get("Producer", (err, data) => {
            if (!err && data != undefined) {
                data = JSON.parse(data);
                let result = _.find(data, req.query);
                res.end(result != undefined ? JSON.stringify(result) : "{}");
            }
        })
    });

    app.get("/producer", (req, res) => {
        db.get("Producer", (err, value) => {
            if (!err && value != undefined) {
                let data = JSON.parse(value);
                if (!err) {
                    if (req.query.limit != undefined) {
                        data = data.splice(0, req.query.limit);
                    }
                    res.end(data.length ? JSON.stringify(data) : "[]");
                } else {
                    res.end("No Data");
                }
            }
        })
    });

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
    /**
     * Login
     */
    app.post("/login", (req, res, next) => {
        passport.authenticate("shopcd-local", (err, userId) => {
            if (err) {
                next(err)
            }
            if (!userId) {
                return res.end(JSON.stringify(new Error(401, "Invalid Credential")));
            } else {
                userId.exp = Math.floor(Date.now() / 1000) + (60 * 60);
                var token = jsonwebtoken.sign(userId, secret);
                return res.end(JSON.stringify({token: token}));
            }
        })(req, res, next)
    });
    /**
     * Authorize User
     */
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
    /**
     * Sign Up
     */
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
    /**
     * User Count
     */
    app.get("/user/count", (req, res, next) => {
        db.get("User", (err, users) => {
            users = JSON.parse(users);
            if (!err) {
                res.end(`${users.length}`);
            }
            res.end('0');
        })
    });
    /**
     * Check Role User
     */
    app.get("/currentUser", (req, res, next) => {
        if (req.query.token != undefined) {
            let decoded = jsonwebtoken.verify(req.query.token, secret);
            if (!err && decoded.id != undefined) {
                db.get("User", (err, users) => {
                    users = JSON.parse(users);
                    if (!err && users.length) {
                        let currentUser = users.find(user => user.id === decoded.id);
                        res.end(currentUser != undefined ? JSON.stringify(_.omit(currentUser, "password")) : "Not Found");
                    }
                })
            }
        }
        res.end("Invalid User");
    });

    /**
     * Update Profile
     */
    app.post("/user/profile/update", (req, res, next) => {
        if (req.body.userId) {
            db.get("User", (err, data) => {
                let users = JSON.parse(data);
                if (!err && users.length) {
                    let currentUser = users.find(user => user.id === req.body.userId);
                    console.log(currentUser);
                    if (currentUser) {
                        console.log(currentUser);
                        Object.assign(currentUser.profile, _.omit(req.body, ["userId", "id"]));
                        users.splice(_.indexOf(users, currentUser), 1, currentUser);
                        console.log(currentUser);
                        db.put("User", JSON.stringify(users), (err) => {
                            if (!err) {
                                res.end(JSON.stringify({success: true}));
                            } else {
                                res.end(JSON.stringify(err));
                            }
                        })
                    } else {
                        res.end("Not Found");
                    }
                } else {
                    res.end("Not Found");
                }
            })
        } else {
            res.end("Unauthorized");
        }
    });

    /*app.get("/user", (req, res, next) => {
     if (req.query.userId) {
     checkRoleUnAuthoriedUser(req.query.userId, "admin", function (isAdmin) {
     if (isAdmin) {
     db.get("User", (err, users) => {
     users = JSON.parse(users);
     if (!err) {
     if (req.query.limit != undefined) {
     users = users.splice(0, req.query.limit);
     }
     res.end(users.length ? JSON.stringify(users) : "[]");
     } else {
     res.end("No Data");
     }
     })
     } else {
     res.end("404 Not Found");
     }
     });

     } else {
     res.end("UNRECOGNIZED")
     }
     });*/

    app.get("/user", (req, res, next) => {
        db.get("User", (err, users) => {
            users = JSON.parse(users);
            if (!err) {
                if (req.query.limit != undefined) {
                    users = users.splice(0, req.query.limit);
                }
                res.end(users.length ? JSON.stringify(users) : "[]");
            } else {
                res.end("No Data");
            }
        })

    });

    app.get("/user/findAll", (req, res, next) => {
        db.get("User", (err, users) => {
            users = JSON.parse(users);
            if (!err) {
                let results = _.filter(users, _.omit(req.query, ["limit", "skip", "userId"]));
                if (req.query.limit != undefined) {
                    results = results.splice(0, req.query.limit);
                }
                res.end(results.length ? JSON.stringify(results) : "[]");
            } else {
                res.end("No Data");
            }
        })
    });

    app.get("/user/findOne", (req, res, next) => {
        db.get("User", (err, users) => {
            users = JSON.parse(users);
            if (!err) {
                let result = _.find(users, req.query);
                res.end(result != undefined ? JSON.stringify(result) : "{}");
            } else {
                res.end("No Data");
            }
        })
    });

    // ----------- User -----------//


    //------------- Cart ---------------//
    app.get("/cart", (req, res, next) => {
        db.get("Cart", (err, data) => {
            if (err) {
                res.end("[]");
            } else {
               let carts = JSON.parse(data);
                if (req.query.limit != undefined) {
                    carts = carts.splice(0, req.query.limit);
                }
                res.end(JSON.stringify(carts));
            }
        })
    });
    /**
     * Cart FindAll
     */
    app.get("/cart/findAll", (req, res, next) => {
        db.get("Cart", (err, carts) => {
            if (!err) {
                carts = JSON.parse(carts);
                let results = _.filter(carts, _.omit(req.query, ["limit", "skip", "userId"]));
                if (req.query.limit != undefined) {
                    results = results.splice(0, req.query.limit);
                }
                res.end(results.length ? JSON.stringify(results) : "[]");
            } else {
                res.end("No Data");
            }
        })
    });

    /**
     * Cart FindOne
     */

    app.get("/cart/findOne", (req, res, next) => {
        db.get("Cart", (err, data) => {
            if (!err) {
                let carts = JSON.parse(data);
                let result = _.find(carts, req.query);
                res.end(result != undefined ? JSON.stringify(result) : "{}");
            } else {
                res.end("No Data");
            }
        })
    });

    app.post("/cart/newCart", (req, res, next) => {
        if (req.body.userId && req.body.cd) {
            db.get("Cart", (err, cartData) => {
                let carts = cartData != undefined ? JSON.parse(cartData) : [];
                if (err || !carts.length) {
                    let cartItems = [];
                    cartItems.push({
                        cd: req.body.cd,
                        quantity: req.body.quantity || 1
                    });
                    let cart = new Cart({
                        userId: req.body.userId,
                        cartItem: cartItems
                    });
                    carts = [];
                    carts.push(cart);
                    db.put("Cart", JSON.stringify(carts), (err) => {
                        if (err) {
                            res.end(JSON.stringify(err));
                        } else {
                            res.end(JSON.stringify({success: true}));
                        }
                    });
                } else {
                    let userCart = carts.find(item => item.userId === req.body.userId);
                    if (userCart) {
                        let cartItems = userCart.cartItem;
                        let getCurrentItem = cartItems.find(item => item.cd === req.body.cd);
                        if (getCurrentItem) {
                            getCurrentItem.quantity += req.body.quantity ? parseInt(req.body.quantity) : 1;
                        } else {
                            cartItems.push({
                                cd: req.body.cd,
                                quantity: req.body.quantity || 1
                            })
                        }
                        carts.splice(_.indexOf(carts, userCart), 1, userCart);
                        db.put("Cart", JSON.stringify(carts), (err) => {
                            if (err) {
                                res.end(JSON.stringify(err));
                            } else {
                                res.end(JSON.stringify({success: true}));
                            }
                        })
                    } else {
                        let cartItems = [];
                        cartItems.push({
                            cd: req.body.cd,
                            quantity: req.body.quantity || 1
                        });
                        let cart = new Cart({
                            userId: req.body.userId,
                            cartItem: cartItems
                        });
                        carts.push(cart);
                        db.put("Cart", JSON.stringify(carts), (err) => {
                            if (err) {
                                res.end(JSON.stringify(err));
                            } else {
                                res.end(JSON.stringify({success: true}));
                            }
                        });
                    }
                }
            })
        } else {
            res.end(JSON.stringify({err: "Require Id"}));
        }
    });

    app.post("/cart/updateCart/removeItem", (req, res, next) => {
        if (req.body.userId && req.body.cd) {
            db.get("Cart", (err, cartData) => {
                let carts = JSON.parse(cartData);
                if (!err && cartData.length) {
                    let userCart = carts.find(item => item.userId === req.body.userId);
                    if (userCart) {
                        let cartItems = userCart.cartItem;
                        let getCurrentItem = _.indexOf(cartItems, _.find(cartItems, item => item.cd === req.body.cd));
                        if (getCurrentItem !== -1) {
                            cartItems.splice(getCurrentItem, 1);
                            userCart.cartItem = cartItems;
                        }
                        carts.splice(_.indexOf(carts, userCart), 1, userCart);
                        db.put("Cart", JSON.stringify(carts), (err) => console.log(err));
                    }
                }
            })
        }
        res.end("Not Found");
    });

    /**
     * Payment Checkout
     */

    app.post("/cart/checkout", (req, res, next) => {
        if (req.body.userId) {
            db.get("Cart", (err, cartData) => {
                let carts = JSON.parse(cartData);
                if (!err && carts.length) {
                    let userCart = carts.find(item => item.userId === req.body.userId);
                    let getCurrentCartIndex = _.indexOf(carts, userCart);
                    if (userCart) {
                        gateway.customer.create({
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            company: req.body.company,
                            email: req.body.email,
                            phone: req.body.phone,
                            fax: req.body.fax,
                            website: req.body.website,
                            creditCard: {
                                paymentMethodNonce: 'nonce-from-the-client',
                                cardholderName: req.body.cardholderName,
                                cvv: req.body.cvv,
                                number: req.body.cardIdentity,
                                expirationMonth: "02",
                                expirationYear: "2022",
                                options: {
                                    verifyCard: true
                                }
                            }
                        }, function (err, result) {
                            console.log("result ", result);
                            if (err) {
                                next(err)
                            } else {
                                userCart.payment = {
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    company: req.body.company,
                                    email: req.body.email,
                                    phone: req.body.phone,
                                    fax: req.body.fax,
                                    website: req.body.website,
                                    cardholderName: req.body.cardholderName,
                                    customerId: result.customer.id,
                                    merchantId: result.customer.merchantId
                                };
                                carts.splice(getCurrentCartIndex, 1, userCart);
                                db.put("Cart", JSON.stringify(carts), (err) => console.log(err));
                                res.end(JSON.stringify(result.customer));
                            }
                        });
                    } else {
                        res.end(JSON.stringify({err: "Not Found"}));
                    }
                } else {
                    res.end(JSON.stringify({err: "Not Found"}));
                }
            })
        } else {
            res.end(JSON.stringify({err: "Unauthorized"}));
        }


    });

    /**
     * Payment Gateway
     */
    app.post("/cart/payment", (req, res, next) => {
        if (req.body.userId) {
            db.get("Cart", (err, cartData) => {
                let carts = JSON.parse(cartData);
                if (!err && carts.length) {
                    let userCart = carts.find(item => item.userId === req.body.userId);
                    if (userCart) {
                        let cartItemIds = _.map(userCart.cartItem, item => item.cd);
                        db.get("CD", (err, disks) => {
                            let data = JSON.parse(disks);
                            if (!err && data.length) {
                                let cartCD = _.filter(data, (item) => _.includes(cartItemIds, item.id));
                                if (cartCD.length) {
                                    let totalCost = cartCD.reduce((total, cd) => {
                                        return total.cost * userCart.cartItem.find(item => item.cd === total.id).quantity + cd.cost * userCart.cartItem.find(item => item.cd === cd.id).quantity;
                                    });
                                    if (userCart.payment != undefined && !userCart.done) {
                                        gateway.transaction.sale({
                                            amount: totalCost,
                                            customerId: userCart.payment.customerId
                                        }, function (err, result) {
                                            if (err) {
                                                res.end(JSON.stringify(err))
                                            }
                                            if (result.success) {
                                                userCart.cartDone = userCart.cartItem;
                                                userCart.cartItem = [];
                                                carts.splice(_.indexOf(carts, userCart), 1, userCart);
                                                db.put("Cart", JSON.stringify(carts), (err) => console.log(err));
                                                res.end(JSON.stringify({
                                                    transactionId: result.transaction.id
                                                }));
                                            } else {
                                                res.end(result.message);
                                            }
                                        });
                                    } else {
                                        res.end(JSON.stringify({err: "Unauthorized"}));
                                    }
                                }
                            }
                        });
                    }
                }
            })
        } else {
            res.end(JSON.stringify({err: "Unauthorized"}));
        }
    });

    //-------------- Cart ---------------//


    //-------------- Role ---------------//

    /**
     * FindAll Role
     */

    app.get("/roles/findAll", (req, res) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        db.get("Roles", (err, data) => {
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
     * FindOne Role
     */
    app.get("/roles/findOne", (req, res) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        db.get("Roles", (err, data) => {
            if (!err && data != undefined) {
                data = JSON.parse(data);
                let result = _.find(data, req.query);
                res.end(result != undefined ? JSON.stringify(result) : "{}");
            }
        })
    });

    app.get("/roles", (req, res) => {
        db.get("Roles", (err, value) => {
            if (!err && value != undefined) {
                let data = JSON.parse(value);
                if (!err) {
                    if (req.query.limit != undefined) {
                        data = data.splice(0, req.query.limit);
                    }
                    res.end(data.length ? JSON.stringify(data) : "[]");
                } else {
                    res.end("No Data");
                }
            }
        })
    });

    //-------------- Role ---------------//

    /**
     * Utils
     */

    function userIsInRole(token, role) {
        db.get("User", (err, users) => {
            users = JSON.parse(users);
            if (!err && users.length) {
                let decodeJWT = jsonwebtoken.verify(token, secret, (err, decoded) => {
                    if (!err && decoded.id != undefined) {
                        let currentUser = users.find(user => user.id === decoded.id);
                        if (currentUser) {
                            db.get("Roles", (err, roles) => {
                                roles = JSON.parse(roles);
                                if (!err && roles.length) {
                                    let userRole = roles.find(role => role.id === currentUser.role);
                                    return new Promise((reject, resolve) => {
                                        resolve(userRole.role === role);
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })
    }

    function checkRoleUnAuthoriedUser(userId, role, callback) {
        db.get("User", (err, users) => {
            users = JSON.parse(users);
            if (!err && users.length) {
                let currentUser = users.find(user => user.id === userId);
                if (currentUser) {
                    db.get("Roles", (err, roles) => {
                        roles = JSON.parse(roles);
                        if (!err && roles.length) {
                            let userRole = roles.find(role => role.id === currentUser.role);
                            callback(userRole.role === role);
                        }
                    })
                }
            }
        });
    }

    app.use((req, res, next) => {
        next("Not Found");
    });
    return app;
};