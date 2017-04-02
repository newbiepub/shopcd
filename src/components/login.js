import React from "react";
import {View} from "react-native";
import {Container, Content, Input, InputGroup, Icon, Button, Label, Form, Item, Text, Spinner} from "native-base";
import {login} from "../actions/login";
import {connect} from "react-redux"

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            inputError: false,
            onLogin: false
        }
    }

    onSignIn() {
        this.setState({onLogin: true});
        const instance = this;
        if (this.state.username != "" && this.state.password != "") {
            this.props.login(this.state.username, this.state.password, instance);
        } else {
            this.setState({inputError: true})
        }
    }

    onSignUp () {
        this.props.navigator.push({
            id: "signup"
        })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <View style={{flex: .25}}/>
                <View style={{flex: .75}}>
                    <Content>
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
                        <Button block disabled={this.state.onLogin} style={{ margin: 15, marginTop: 50 }} onPress={this.onSignIn.bind(this)}>
                            {
                                this.state.onLogin ?
                                    <Spinner/>
                                    :
                                    <Text>Sign In</Text>
                            }

                        </Button>
                        <View style={{flex: 1, flexDirection: "row"}}>
                            <View style={{flex: .5}}>
                                <Button transparent style={{alignSelf: "center"}} onPress={this.onSignUp.bind(this)}>
                                    <Text>
                                        Sign Up
                                    </Text>
                                </Button>
                            </View>
                            <View style={{flex: .5}}>
                                <Button transparent style={{alignSelf: "center"}}>
                                    <Text>
                                        Forgot Password
                                    </Text>
                                </Button>
                            </View>
                        </View>
                    </Content>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        account: state.account
    }
};

const mapDispatchToProps = {
    login
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);