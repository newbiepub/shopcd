import React from "react";
import { View } from "react-native";
import config from "../../config.json";
import { Content, Container, Input, InputGroup, Item, Button, Label, Form, Text } from "native-base";

class EditProducer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            producerName: "",
            email: "",
            phone: "",
            address: ""
        }
    }

    componentWillMount() {
        if(this.props.collectionData.id) {
            fetch(`${config.api}/producer/findOne?id=${this.props.collectionData.id}`, {
                method: "GET"
            }).then(res => res.json())
                .then(data => {
                    this.setState({
                        producerName: data.producerName,
                        email: data.email,
                        phone: data.phone,
                        address: data.address
                    })
                })
        }
    }

    onUpdate() {
        fetch(`${config.api}/producer/update?id=${this.props.collectionData.id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        }).then(res => res.json())
            .then(response => {
                if(response.success) {
                    this.props.collectionData.instance.props.getCollection("producer", 15);
                    this.props.navigator.pop();
                }
            })
    }

    onCreate () {
        fetch(`${config.api}/producer/new?id=${this.props.collectionData.id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        }).then(res => res.json())
            .then(response => {
                if(response.success) {
                    this.props.data.instance.props.getCollection("producer", 15);
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
                                <Label>Producer Name</Label>
                                <Input
                                    onChangeText={(producerName) => {
                                        this.setState({producerName})
                                    }}
                                    value={this.state.producerName}/>
                            </Item>
                            <Item stackedLabel>
                                <Label>Email</Label>
                                <Input
                                    multiline={true}
                                    onChangeText={(email) => {
                                        this.setState({email})
                                    }}
                                    value={`${this.state.email}`}/>
                            </Item>
                            <Item stackedLabel>
                                <Label>Phone</Label>
                                <Input
                                    multiline={true}
                                    onChangeText={(phone) => {
                                        this.setState({phone})
                                    }}
                                    value={`${this.state.phone}`}/>
                            </Item>
                            <Item stackedLabel>
                                <Label>Address</Label>
                                <Input
                                    multiline={true}
                                    onChangeText={(address) => {
                                        this.setState({address})
                                    }}
                                    value={`${this.state.address}`}/>
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

export default EditProducer;