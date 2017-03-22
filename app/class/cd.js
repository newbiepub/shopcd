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
    }
}

module.exports = CD;