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
    Item,
    InputGroup,
    Toast,
    Label,
    Button,
    Icon,
    Badge,
    Right,
    CardItem,
    Card,
    H1,
    Form
} from "native-base";
import  {connect} from "react-redux";
import styleIndicator from "./style/indicator";
import config from "../config.json";

class Payment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalCost: 0
        }
    }

    componentWillMount() {
        fetch(`${config.api}/cart/findOne?userId=${this.props.account.user.id}`, {
            method: "GET"
        }).then(res => res.json())
            .then(response => {
                if (response.cartItem.length) {
                    response.cartItem.forEach((item, index) => {
                        fetch(`${config.api}/cd/findOne?id=${item.cd}`, {
                            method: "GET"
                        }).then(res => res.json())
                            .then(response => {
                                let cost = this.state.totalCost;
                                cost += response.cost;
                                this.setState({totalCost: cost});
                            })
                    })
                }
            })
    }

    onSubmit() {
        fetch(`${config.api}/cart/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: this.props.account.user.id
            })
        }).then(res => res.json())
            .then(response => {
                if(response.err) {
                    ToastAndroid.show(response.err, ToastAndroid.LONG);
                } else {
                    Toast.show({
                        type:"success",
                        text: 'Payment Completed !! Back To Home In 2 Secs',
                        position: 'bottom',
                        buttonText: 'OK'
                    })
                    setTimeout(() => {
                        this.props.navigator.popToTop();
                    }, 2000)
                }
            })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                <Card style={{padding: 10}}>
                    <CardItem header={true}>
                        <H1>
                            Payment
                        </H1>
                    </CardItem>
                    <CardItem>
                        <Item>
                            <Label>
                                Total Cost
                            </Label>
                            <Text style={{marginLeft: 20}}>
                                {this.state.totalCost}
                            </Text>
                        </Item>
                    </CardItem>
                    <CardItem footer={true}>
                        <Button block success={true} onPress={this.onSubmit.bind(this)}>
                            <Text>
                                Complete
                            </Text>
                        </Button>
                    </CardItem>
                </Card>
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

export default connect(mapStateToProps, null)(Payment);