const faker = require("faker");
/**
 * Define Cart Model
 */
class Cart {
    constructor(props) {
        this.id = faker.random.uuid();
        this.userId = props.userId;
        this.cartItem = props.cartItem;
        this.createdAt = new Date();
        this.approved = false;
        this.done = false;
        this.payment = props.payment
    }
}

module.exports = Cart;