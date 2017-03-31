const faker = require("faker");
/**
 * Define Producer Model
 */
class Producer {
    constructor(props) {
        this.id = faker.random.uuid();
        this.producerName = props.producerName;
        this.email = props.email;
        this.phone = props.phone;
        this.address = props.address;
    }
}

module.exports = Producer;