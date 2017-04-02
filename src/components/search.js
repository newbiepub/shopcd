import React from "react";
import {View} from "react-native";
import config from "../config.json";
import {Container, Content, Header, Button, Icon, Input, InputGroup, Text, Item, List, Spinner, ListItem, Thumbnail, Body} from "native-base";
import styleIndicator from "./style/indicator";
import {connect} from "react-redux";
import { getCartItems } from "../actions/data";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: "",
            searchData: [],
            loading: false
        }
    }

    componentWillMount() {

    }

    submitSearch() {
        this.setState({loading: true});
        fetch(`${config.api}/cd?search=${this.state.searchString}`, {
            method: "GET"
        }).then(res => res.json())
            .then(searchData => {
                setTimeout(() => {
                    this.setState({searchData, loading: false})
                }, 500)
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
            //console.warn(JSON.stringify(res, null, 4));
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

    renderItem (item) {
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

    render() {
        return (
            <Container style={{backgroundColor: "white"}}>
                <Header searchBar rounded>
                    <Item>
                        <Icon active name="search"/>
                        <Input
                            onTextChange={(searchString) => this.setState({searchString})}
                            placeholder="Search"
                            onSubmitEditing={this.submitSearch.bind(this)}/>
                        <Icon active name="people"/>
                    </Item>
                </Header>

                <Content padder>
                    {
                        this.state.loading ?
                            <View style={styleIndicator.indicator}>
                                <Spinner style={{alignSelf: "center"}}/>
                            </View>
                            :
                            <List
                                enableEmptySections={true}
                                dataArray={this.state.searchData}
                                renderRow={this.renderItem.bind(this)}
                            />
                    }
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        account: state.account
    }
};

const mapDispatchToProps = {
    getCartItems
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);