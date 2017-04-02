import React from "react";
import {View} from "react-native";
import config from "../../config.json";
import {
    Content,
    Container,
    Input,
    InputGroup,
    Item,
    Button,
    Label,
    Form,
    Text,
    H1,
    CheckBox,
    CardItem,
    ListItem,
    Card
} from "native-base";
import {connect} from "react-redux";

class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            sex: true,
            picture: ""
        }
    }

    componentWillMount() {
        fetch(`${config.api}/user/findOne?id=${this.props.account.user.id}`, {
            method: "GET"
        }).then(res => res.json())
            .then(data => {
                this.setState({
                    name: data.profile.name ? data.profile.name : "",
                    email: data.profile.email ? data.profile.email : "",
                    picture: data.profile.picture ? data.profile.picture : "",
                    sex: data.profile.sex ? true : false
                })
            })
    }

    onUpdate() {
        fetch(`${config.api}/user/profile/update`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: this.props.account.user.id,
                ...this.state
            })
        }).then(function(res) {return res.json()}).then(function(success) {console.log(JSON.stringify(success))})
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <Container>
                    <Content>
                        <Card style={{padding: 10}}>
                            <CardItem header={true} style={{borderBottomWidth: 0.3333}}>
                                <H1>
                                    Profile Detail
                                </H1>
                            </CardItem>
                            <CardItem content>
                                <Form>
                                    <Item stackedLabel>
                                        <Label>Name</Label>
                                        <Input
                                            onChangeText={(name) => {
                                        this.setState({name})
                                    }}
                                            value={this.state.name}/>
                                    </Item>
                                    <Item stackedLabel>
                                        <Label>Email</Label>
                                        <Input
                                            onChangeText={(email) => {
                                        this.setState({email})
                                    }}
                                            value={`${this.state.email}`}/>
                                    </Item>
                                    <Item stackedLabel>
                                        <Label>Picture</Label>
                                        <Input
                                            onChangeText={(email) => {
                                        this.setState({email})
                                    }}
                                            value={`${this.state.picture}`}/>
                                    </Item>
                                    <ListItem>
                                        <Label>Sex</Label>
                                        <CheckBox
                                            style={{marginLeft: 20}}
                                            checked={this.state.sex}
                                                  onPress={() => this.setState({sex: !this.state.sex})}/>
                                    </ListItem>
                                </Form>
                            </CardItem>
                            <Button block onPress={this.onUpdate.bind(this)}>
                                <Text>
                                    Update
                                </Text>
                            </Button>
                        </Card>
                    </Content>
                </Container>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        account: state.account
    }
};

export default connect(mapStateToProps, null)(EditProfile);