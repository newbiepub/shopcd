/**
 * Define Cart Model
 */
class Cart {
    constructor(props) {
        this.id = props.id;
        this.userId = props.userId;
        this.cartItem = props.cartItem;
        this.createdAt = new Date();
        this.approved = false;
        this.done = false;
        this.cost = 0;
    }
}

module.exports = Cart;