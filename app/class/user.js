/**
 * Define User Model
 */
class User {
    constructor(props) {
        this.id = props.id;
        this.username = props.username;
        this.password = props.password;
        this.profile = props.profile;
        this.role = props.role;
    }
}

module.exports = User;