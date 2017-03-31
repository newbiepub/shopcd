const faker = require("faker");
class Role {
    constructor(props) {
        this.id = faker.random.uuid();
        this.role = props.role;
        this.description = props.description || "";
    }
}

module.exports = Role;