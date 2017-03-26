const faker = require("faker");
/**
 * Define CD model
 * */
class CD {
    constructor(props) {
        this.id = props.id;
        this.title = props.title;
        this.summary = props.summary;
        this.description = props.description;
        this.image = props.image;
        this.producer = props.producer;
        this.publishedAt = faker.date.recent();
        this.category = props.category;
        this.type = props.type;
    }
}

module.exports = CD;