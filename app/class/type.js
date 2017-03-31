const faker = require("faker");
/**
 * Defined Type Model
 */
class Type {
    constructor(props) {
        this.id = faker.random.uuid();
        this.name = props.name;
    }
}

module.exports = Type;