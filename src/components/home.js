import React from "react";
import {View, ToastAndroid} from 'react-native';
import {List, ListItem, Spinner, Text, Thumbnail, Body, Button, Icon} from "native-base";
import  {connect} from "react-redux";
import {getCD, getCartItems} from "../actions/data";
import styleIndicator from "./style/indicator";
import config from "../config.json";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 15,
            route: null
        }
    }

    componentWillMount() {
        setTimeout(() => {
            this.props.getCD(this.state.limit);
        }, 500)
    }

    componentWillUpdate(nextProps, netState) {
        if(this.props.account.loginState != nextProps.account.loginState) {
            setTimeout(() => {
                this.props.getCD(this.state.limit);
                this.props.getCartItems(this.props.account.user.id);
            }, 500)
        }
    }

    onPressItem(id) {
        this.props.navigator.push({
            id: "detail",
            data: id
        })
    }

    addToCart (item) {
        fetch(`${config.api}/cart/newCart`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: this.props.account.user.id,
                cd: item.id
            })
        }).then(res => {
            return res.json();
        })
            .then(response => {
                if(response.success) {
                    this.props.getCartItems(this.props.account.user.id);
                    ToastAndroid.show("Item Has Been Add To Cart", ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show("Cannot add to cart", ToastAndroid.SHORT);
                }
            })
    }

    renderItem(item) {
        return (
            <ListItem onPress={() => this.onPressItem(item.id)}>
                <Thumbnail square size={80} source={{uri: item.image}}/>
                <Body>
                <Text>{item.title}</Text>
                <Text note numberOfLines={3}>{item.summary}</Text>
                {(this.props.account.loginState && this.props.account.role.role !== "admin") &&
                    <Button transparent iconLeft style={{zIndex: 20}} onPress={() => this.addToCart(item)}>
                        <Icon name='cart'/>
                        <Text>Add to Cart</Text>
                    </Button>
                }
                </Body>
            </ListItem>
        )
    }

    onEndReached() {
        let limit = this.state.limit;
        limit += 15;
        this.setState({limit});
        setTimeout(() => {
            this.props.getCD(limit);
        }, 500)
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {
                    this.props.data.length ?
                        <List
                            dataArray={this.props.data}
                            renderRow={this.renderItem.bind(this)}
                            onEndReached={this.onEndReached.bind(this)}
                        />
                        :
                        <View style={[styleIndicator.indicator]}>
                            <Spinner style={{alignSelf: "center"}} color='#168ed0'/>
                        </View>
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.diskData.cd,
        account: state.account
    }
}

const mapDispatchToProps = {
    getCD,
    getCartItems
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

