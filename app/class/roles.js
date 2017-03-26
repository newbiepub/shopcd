class Role {
    constructor(props) {
        this.id = props.id;
        this.role = props.role;
        this.description = props.description || "";
    }
}

module.exports = Role;