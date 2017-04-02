import React from "react";
import { View } from "react-native";
import config from "../../config.json";
import { Content, Container, Input, InputGroup, Item, Button, Label, Form, Text } from "native-base";

class EditCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            priority: ""
        }
    }

    componentWillMount() {
        if(this.props.collectionData.id) {
            fetch(`${config.api}/category/findOne?id=${this.props.collectionData.id}`, {
                method: "GET"
            }).then(res => res.json())
                .then(data => {
                    this.setState({
                        name: data.name,
                        priority: data.priority
                    })
                })
        }
    }

    onUpdate() {
        fetch(`${config.api}/category/update?id=${this.props.collectionData.id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        }).then(res => res.json())
            .then(response => {
                if(response.success) {
                    this.props.collectionData.instance.props.getCollection("category", 15);
                    this.props.navigator.pop();
                }
            })
    }

    onCreate () {
        fetch(`${config.api}/category/new?id=${this.props.collectionData.id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        }).then(res => res.json())
            .then(response => {
                if(response.success) {
                    this.props.data.instance.props.getCollection("category", 15);
                    this.props.navigator.pop();
                }
            })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <Container>
                    <Content>
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
                                <Label>Priority</Label>
                                <Input
                                    multiline={true}
                                    onChangeText={(priority) => {
                                        this.setState({priority})
                                    }}
                                    value={`${this.state.priority}`}/>
                            </Item>
                        </Form>
                        {this.props.type === "update" ?
                            <Button block onPress={this.onUpdate.bind(this)}>
                                <Text>
                                    Update
                                </Text>
                            </Button>
                            :
                            <Button block onPress={this.onCreate.bind(this)}>
                                <Text>
                                    Create
                                </Text>
                            </Button>
                        }
                    </Content>
                </Container>
            </View>
        )
    }
}

export default EditCategory;