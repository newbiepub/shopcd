/**
 * Import { * }
 * @type {Router}
 */
const Router = require("router"),
    finalhandler = require("finalhandler"),
    http = require("http"),
    routes = require("./routes"),
    CD = require("./class/cd"),
    db = require("./db"),
    faker = require("faker"),
    password = require('password-hash-and-salt'),
    User = require("./class/user"),
    Role = require("./class/roles"),
    Producer = require("./class/producer"),
    Category = require("./class/category"),
    Type = require("./class/type"),
    _ = require("lodash");
/**
 * Create Server
 */
const app = routes(new Router());
const server = http.createServer();

/**
 * Create CD Function
 */
function createCD(producers, categories, type) {
    let data = [];
    while (data.length < 500) {
        let cd = new CD({
            id: faker.random.uuid(),
            title: faker.lorem.words(),
            summary: faker.lorem.sentences(),
            description: faker.lorem.paragraphs(),
            image: faker.image.people(),
            producer: producers[Math.floor(Math.random() * producers.length)].id,
            category: categories[Math.floor(Math.random() * categories.length)].id,
            type: type[Math.floor(Math.random() * type.length)].name,
            vote: 0,
            cost: faker.random.number()
        });
        data.push(cd);
    }
    db.put('CD', JSON.stringify(data), (err) => {
        if (err) {
            console.log(err);
        }
    })
}

/**
 * Run When Server Started
 * @param app
 */
const boot = (app) => {
    /**
     * Initial Roles
     */
    db.get("Roles", (err, res) => {
        if (err) {
            let adminRole = new Role({
                id: faker.random.uuid(),
                role: "admin",
                description: "Admin Role"
            });
            let userRole = new Role({
                id: faker.random.uuid(),
                role: "user",
                description: "User Role"
            });
            db.put("Roles", JSON.stringify([adminRole, userRole]), (err) => console.log(err));
        }
    });
    /**
     * Initial Producer
     */
    db.get("Producer", (err, res) => {
        if (err) {
            let producers = [];
            while (producers.length < 5) {
                let producer = new Producer({
                    id: faker.random.uuid(),
                    producerName: faker.company.companyName(),
                    email: faker.internet.email(),
                    phone: faker.phone.phoneNumber(),
                    address: `${faker.address.streetName()}, ${faker.address.city()}`
                });
                producers.push(producer);
            }
            db.put("Producer", JSON.stringify(producers), (err) => console.log(err));
        }
    });
    /**
     * Initial Category
     */
    db.get("Category", (err, res) => {
        if (err) {
            let categories = ["Phim Hành Động", "Phim Kinh Dị", "Phim Tình Cảm", "Nhạc Kịch", "Phần Mềm"],
                category = [];
            _.each(categories, (item) => {
                let categoryItem = new Category({
                    id: faker.random.uuid(),
                    name: item,
                    priority: faker.random.number()
                });
                category.push(categoryItem);
            });
            db.put("Category", JSON.stringify(category), (err) => console.log(err));
        }
    });

    /**
     * Initial Type
     */
    db.get("Type", (err, res) => {
        if (err) {
            let types = ["CD", "DVD"],
                data = [];
            _.each(types, (type) => {
                let typeItem = new Type({
                    id: faker.random.uuid(),
                    name: type
                });
                data.push(typeItem);
            });
            db.put("Type", JSON.stringify(data), (err) => console.log(err));
        }
    });

    /**
     * Initial 500 CD-document
     */
    db.get("CD", (err, res) => {
        if (err) {
            db.get("Producer", (err, producers) => {
                if (!err) {
                    producers = JSON.parse(producers);
                    db.get("Category", (err, categories) => {
                        if (!err) {
                            categories = JSON.parse(categories);
                            db.get("Type", (err, types) => {
                                if (!err) {
                                    types = JSON.parse(types);
                                    createCD(producers, categories, types);
                                }
                            })
                        }
                    })
                }
            });
        }
    });
    /**
     * Create Admin User
     */
    db.get("User", (err, users) => {
        if (err) {
            db.get("Roles", (err, roles) => {
                roles = JSON.parse(roles);
                if (!err && roles.length) {
                    let adminRole = roles.find(role => role.role === "admin");
                    let username = "lamnguyen2306";
                    // Create password with salt and hash
                    password("h1n2i3m4").hash(function (err, hash) {
                        if (!err) {
                            let user = new User({
                                id: faker.random.uuid(),
                                username: username,
                                password: hash,
                                profile: {
                                    name: "Lam Nguyen",
                                    sex: true,
                                    picture: faker.image.avatar(),
                                    email: "lam@example.com"
                                },
                                role: adminRole.id
                            });
                            db.put("User", JSON.stringify([user]), (err) => console.log(err));
                        }
                    });
                }
            });
        }
    })
};


/**
 * Boot App
 * */
boot(app);

/**
 * On Request
 */
server.on("request", (req, res) => {
    app(req, res, finalhandler(req, res));
});

module.exports = server;