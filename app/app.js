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
    User = require("./class/user");
/**
 * Create Server
 */
const app = routes(new Router());
const server = http.createServer();

/**
 * Run When Server Started
 * @param app
 */
const boot = (app) => {
    /**
     * Initial 500 CD-document
     */
    db.get("CD", (err, res) => {
        if (err) {
            let data = [];
            while (data.length < 500) {
                let cd = new CD({
                    id: faker.random.uuid(),
                    title: faker.lorem.words(),
                    summary: faker.lorem.sentences(),
                    description: faker.lorem.paragraphs(),
                    image: faker.image.people()
                });
                data.push(cd);
            }
            db.put('CD', JSON.stringify(data), (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    });
    /**
     * Create Admin User
     */
    db.get("User", (err, users) => {
        if(err) {
            let username = "lam@example.com";
            // Create password with salt and hash
            password("h1n2i3m4").hash(function (err, hash) {
               if(!err) {
                   let user = new User({username: username, password: hash});
                   db.put("User", JSON.stringify([user]), (err) => {
                       if(err) {
                           console.log(err);
                       }
                   })
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