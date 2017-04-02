import React from "react";
import {View, Image} from "react-native";
import config from "../config.json";
import {Container, Content, CardItem, Card, Title, Text, Button, Body} from "native-base";
import StarRating from 'react-native-star-rating';
import { connect } from "react-redux";

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disk: {},
            loading: true,
            vote: 0
        }
    }

    componentWillMount() {
        fetch(`${config.api}/cd/findOne?id=${this.props.data}`, {
            method: "GET"
        }).then(res => res.json())
            .then(response => {
                this.setState({disk: response, loading: false});
            })
        fetch(`${config.api}/cd/vote?id=${this.props.data}`, {
            method: "GET"
        }).then(res => res.json())
            .then(response => {
                this.setState({vote: response.vote});
            })
    }

    upVote(rating) {
        fetch(`${config.api}/cd/upVote`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: this.props.account.user.id,
                id: this.props.data,
                vote: rating
            })
        }).then(res => res.json())
            .then(response => {
                console.log(JSON.stringify(response));
            })
    }

    render() {
        return (
            <Container style={{backgroundColor: "white"}}>
                <Content>
                    <Card>
                        <CardItem header={true}>
                            <Text style={{fontSize: 24, fontWeight: "bold"}}>
                                {this.state.disk.title}
                            </Text>
                        </CardItem>
                        <CardItem cardBody={true}>
                            <Image source={{uri: this.state.disk.image}} style={{ resizeMode: 'cover', width: null, height: 200, flex: 1 }}/>
                        </CardItem>
                        <CardItem content>
                            <Text>
                                {this.state.disk.description}
                            </Text>
                        </CardItem>
                        <CardItem footer={true}>
                            <StarRating
                                disabled={false}
                                emptyStar={'ios-star-outline'}
                                fullStar={'ios-star'}
                                halfStar={'ios-star-half'}
                                iconSet={'Ionicons'}
                                maxStars={5}
                                rating={this.state.vote}
                                selectedStar={this.upVote.bind(this)}
                                starColor={"yellow"}
                            />
                        </CardItem>
                    </Card>
                </Content>
            </Container>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        account: state.account
    }
};


export default connect(mapStateToProps, null) (Detail);
