import React from "react";
import {View, ToastAndroid} from 'react-native';
import {
    Container,
    Content,
    List,
    ListItem,
    Spinner,
    Text,
    Thumbnail,
    Body,
    Input,
    InputGroup,
    Label,
    Button,
    Icon,
    Badge,
    Right,
    CardItem,
    Card,
    H1,
    Form,
    Item
} from "native-base";
import  {connect} from "react-redux";
import styleIndicator from "./style/indicator";
import config from "../config.json";

class Checkout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            company: "",
            email: "",
            phone: "",
            fax: "",
            website: "",
            cardholderName: "",
            cvv: "123",
            number: "4111111111111111"
        }
    }

    componentWillMount() {
        fetch(`${config.api}/cart/findOne?userId=${this.props.account.user.id}`, {
            method: "GET"
        }).then(res => res.json())
            .then(response => {
                setTimeout(() => {
                    if (response.payment != undefined) {
                        this.setState({
                            firstName: response.payment.firstName ? response.payment.firstName : "",
                            lastName: response.payment.lastName ? response.payment.lastName : "",
                            company: response.payment.company ? response.payment.company : "",
                            email: response.payment.email ? response.payment.email : "",
                            phone: response.payment.phone ? response.payment.phone : "",
                            fax: response.payment.fax ? response.payment.fax : "",
                            website: response.payment.website ? response.payment.website : "",
                            cardholderName: response.payment.cardholderName ? response.payment.cardholderName : ""
                        })
                    }
                }, 500);
            })
    }

    onCheckoutSubmit() {
        let payload = Object.assign(this.state, {userId: this.props.account.user.id});
        fetch(`${config.api}/cart/checkout`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then(res => res.json())
            .then(response => {
                if(response.err) {
                    ToastAndroid.show(response.err, ToastAndroid.LONG);
                } else {
                    this.props.navigator.push({
                        id: "payment"
                    })
                }
            })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <Container>
                    <Content>
                        <Card>
                            <CardItem header={true}>
                                <H1>
                                    Check Out
                                </H1>
                            </CardItem>
                            <Form>
                                <Item inlineLabel>
                                    <Label>First Name</Label>
                                    <Input
                                        onChangeText={(firstName) => {
                                        this.setState({firstName})
                                    }}
                                        value={this.state.firstName}/>
                                </Item>
                                <Item inlineLabel>
                                    <Label>Last Name</Label>
                                    <Input
                                        multiline={true}
                                        onChangeText={(lastName) => {
                                        this.setState({lastName})
                                    }}
                                        value={`${this.state.lastName}`}/>
                                </Item>
                                <Item inlineLabel>
                                    <Label>Company</Label>
                                    <Input
                                        multiline={true}
                                        onChangeText={(company) => {
                                        this.setState({company})
                                    }}
                                        value={`${this.state.company}`}/>
                                </Item>
                                <Item inlineLabel>
                                    <Label>Email</Label>
                                    <Input
                                        multiline={true}
                                        onChangeText={(email) => {
                                        this.setState({email})
                                    }}
                                        value={`${this.state.email}`}/>
                                </Item>
                                <Item inlineLabel>
                                    <Label>Card Holder</Label>
                                    <Input
                                        multiline={true}
                                        onChangeText={(cardholderName) => {
                                        this.setState({cardholderName})
                                    }}
                                        value={`${this.state.cardholderName}`}/>
                                </Item>
                                <Item inlineLabel>
                                    <Label>Card Number</Label>
                                    <Input
                                        multiline={true}
                                        onChangeText={(number) => {
                                        this.setState({number})
                                    }}
                                        value={`${this.state.number}`}/>
                                </Item>
                                <Item inlineLabel>
                                    <Label>CVV</Label>
                                    <Input
                                        multiline={true}
                                        onChangeText={(cvv) => {
                                        this.setState({cvv})
                                    }}
                                        value={`${this.state.cvv}`}/>
                                </Item>
                                <Item inlineLabel>
                                    <Label>Phone</Label>
                                    <Input
                                        multiline={true}
                                        onChangeText={(phone) => {
                                        this.setState({phone})
                                    }}
                                        value={`${this.state.phone}`}/>
                                </Item>
                                <Item inlineLabel>
                                    <Label>Fax</Label>
                                    <Input
                                        multiline={true}
                                        onChangeText={(fax) => {
                                        this.setState({fax})
                                    }}
                                        value={`${this.state.fax}`}/>
                                </Item>
                                <Item inlineLabel>
                                    <Label>Website</Label>
                                    <Input
                                        multiline={true}
                                        onChangeText={(website) => {
                                        this.setState({website})
                                    }}
                                        value={`${this.state.website}`}/>
                                </Item>
                            </Form>
                            <Button block success={true} onPress={this.onCheckoutSubmit.bind(this)}>
                                <Text>
                                    Submit
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
        account: state.account,
        diskData: state.diskData
    }
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, null)(Checkout);