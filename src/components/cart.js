import React from "react";
import {View, ToastAndroid} from 'react-native';
import {List, ListItem, Spinner, Text, Thumbnail, Body, Button, Icon, Badge, Right} from "native-base";
import  {connect} from "react-redux";
import styleIndicator from "./style/indicator";
import config from "../config.json";

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
            emptyCart: false
        }
    }

    componentWillMount() {
        fetch(`${config.api}/cart/findOne?userId=${this.props.account.user.id}`, {
            method: "GET"
        }).then(res => res.json())
            .then(response => {
                setTimeout(() => {
                    if (response.cartItem) {
                        this.setState({cart: response.cartItem});
                    } else {
                        this.setState({emptyCart: true});
                    }

                }, 500);
            })
    }

    renderItem(data) {
        let item = this.props.diskData.cd.find(disc => disc.id === data.cd);
        return (
            <ListItem
                delayLongPress={3800}
                onLongPress={() => {}}
            >
                <Thumbnail square size={80} source={{uri: item.image}}/>
                <Body>
                <Text>{item.title}</Text>
                <Text note numberOfLines={3}>{item.summary}</Text>
                </Body>
                <Right>
                    <Badge>
                        <Text>
                            {data.quantity}
                        </Text>
                    </Badge>
                </Right>
            </ListItem>
        )
    }

    onCheckout() {
        this.props.navigator.push({
            id: "checkout"
        })
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                {this.state.emptyCart ?
                    <View>
                        <Text>
                            Oops !! Nothing's in here !!
                        </Text>
                    </View>
                    :
                    this.state.cart.length ?
                        <View style={{padding: 10}}>
                            <View>
                                <List
                                    dataArray={this.state.cart}
                                    renderRow={this.renderItem.bind(this)}
                                />
                                <Button block success={true} onPress={this.onCheckout.bind(this)}>
                                    <Text>
                                        Check Out
                                    </Text>
                                </Button>
                            </View>

                        </View>

                        :
                        <View style={styleIndicator.indicator}>
                            <Spinner style={{alignSelf: "center"}}/>
                        </View>
                }
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

export default connect(mapStateToProps, null)(Cart);