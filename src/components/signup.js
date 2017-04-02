import React from "react";
import {View ,ToastAndroid} from "react-native";
import {Container, Content, Input, InputGroup, Icon, Button, Label, Form, Item, Text, ListItem, H1} from "native-base";
import {connect} from "react-redux";
import config from "../config.json";

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    onSignUp () {
        fetch (`${config.api}/signup`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: this.state.username, password: this.state.password})
        }).then(res => res.json())
            .then (response => {
                if(response.success) {
                    console.log(response.success);
                    this.props.navigator.pop();
                    ToastAndroid.show("Sign Up Success Please Login !!!", ToastAndroid.SHORT);
                }  else {
                    ToastAndroid.show(response.err, ToastAndroid.SHORT);
                }
            })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <View style={{flex: .25}}/>
                <View style={{flex: .75}}>
                    <Content>
                        <ListItem>
                            <H1>
                                New Account
                            </H1>
                        </ListItem>
                        <Form>
                            <Item floatingLabel>
                                <Label>Username</Label>
                                <Input onChangeText={(username) => {
                                        this.setState({username})
                                    }}/>
                            </Item>
                            <Item floatingLabel>
                                <Label>Password</Label>
                                <Input secureTextEntry onChangeText={(password) => {
                                    this.setState({password})
                                }}/>
                            </Item>
                        </Form>
                        <Button block style={{ margin: 15, marginTop: 50 }} onPress={this.onSignUp.bind(this)}>
                            <Text>Sign Up</Text>
                        </Button>
                    </Content>
                </View>
            </View>
        )
    }
}

export default SignUp;