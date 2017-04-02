import React from "react";
import {View} from "react-native";
import {Form, Text, Input, InputGroup, Button, Item, Label, Container, Content} from "native-base";
import config from "../../config.json";

class EditDisc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            summary: "",
            image: "",
            description: "",
            cost: ""
        }
    }

    componentWillMount() {
        if(this.props.collectionData.id) {
            fetch(`${config.api}/cd/findOne?id=${this.props.collectionData.id}`, {
                method: "GET"
            }).then(res => res.json())
                .then(data => {
                    this.setState({
                        title: data.title,
                        summary: data.summary,
                        image: data.image,
                        description: data.description,
                        cost: data.cost
                    })
                })
        }
    }

    onUpdate() {
        fetch(`${config.api}/cd/update?id=${this.props.collectionData.id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        }).then(res => res.json())
            .then(response => {
                if(response.success) {
                    this.props.collectionData.instance.props.getCollection("cd", 15);
                    this.props.navigator.pop();
                }
            })
    }

    onCreate () {
        fetch(`${config.api}/cd/new?id=${this.props.collectionData.id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        }).then(res => res.json())
            .then(response => {
                if(response.success) {
                    this.props.data.instance.props.getCollection("cd", 15);
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
                                <Label>Title</Label>
                                <Input
                                    onChangeText={(title) => {
                                        this.setState({title})
                                    }}
                                    value={this.state.title}/>
                            </Item>
                            <Item stackedLabel>
                                <Label>Summary</Label>
                                <Input
                                    multiline={true}
                                    onChangeText={(summary) => {
                                        this.setState({summary})
                                    }}
                                    value={this.state.summary}/>
                            </Item>
                            <Item stackedLabel>
                                <Label>Description</Label>
                                <Input
                                    multiline={true}
                                    onChangeText={(description) => {
                                        this.setState({description})
                                    }}
                                    value={this.state.description}/>
                            </Item>
                            <Item stackedLabel>
                                <Label>Image</Label>
                                <Input
                                    onChangeText={(description) => {
                                        this.setState({description})
                                    }}
                                    value={this.state.image}/>
                            </Item>
                            <Item stackedLabel>
                                <Label>Cost</Label>
                                <Input
                                    onChangeText={(description) => {
                                        this.setState({cost})
                                    }}
                                    value={`${this.state.cost}`}/>
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

export default EditDisc;