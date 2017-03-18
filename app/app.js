const Router = require("router"),
    finalhandler = require("finalhandler"),
    http = require("http"),
    routes = require("./routes"),
    CD = require("./class/cd"),
    db = require("./db"),
    faker = require("faker");

const app = routes(new Router());
const server = http.createServer();
const boot = () => {
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
    })
};

server.on("request", (req, res) => {
    boot();
    app(req, res, finalhandler(req, res));
});

module.exports = server;