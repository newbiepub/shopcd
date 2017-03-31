const faker = require("faker");
/**
 * Define Category Model
 */
class Category {
    constructor(props) {
        this.id = faker.random.uuid();
        this.name = props.name;
        this.priority = props.priority;
    }
}

module.exports = Category;
