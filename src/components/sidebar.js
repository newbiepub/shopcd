import React from "react";
import {View, Image} from "react-native";
import {Card, CardItem, Left, Body, Right, Text, Button, Icon} from "native-base";
import {connect} from "react-redux";

class SideBar extends React.Component {
    constructor(props) {
        super(props)
    }

    getCurrentRoute() {
        let routes = this.props.navigator.getCurrentRoutes();
        return routes[routes.length - 1];
    }

    drawerClose() {
        this.props.drawer._root.close();
    }

    onPressCart() {
        this.drawerClose();
        let route = {
            id: "collection",
            data: {
                collection: "cart"
            }
        };
        if(this.getCurrentRoute().id === "collection") {
            this.props.navigator.replace(route);
        } else {
            this.props.navigator.push(route);
        }

    }

    onPressDisc() {
        this.drawerClose();
        let route = {
            id: "collection",
            data: {
                collection: "cd"
            }
        };
        if(this.getCurrentRoute().id === "collection") {
            this.props.navigator.replace(route);
        } else {
            this.props.navigator.push(route);
        }
    }

    onPressCategory() {
        this.drawerClose();
        let route = {
            id: "collection",
            data: {
                collection: "category"
            }
        };
        if(this.getCurrentRoute().id === "collection") {
            this.props.navigator.replace(route);
        } else {
            this.props.navigator.push(route);
        }
    }

    onPressProducer () {
        this.drawerClose();
        let route = {
            id: "collection",
            data: {
                collection: "producer"
            }
        };
        if(this.getCurrentRoute().id === "collection") {
            this.props.navigator.replace(route);
        } else {
            this.props.navigator.push(route);
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Image style={{flex: .35}}
                       source={{uri: "https://ae01.alicdn.com/kf/HTB1w48lKFXXXXXyXFXXq6xXFXXXZ/bb143-OPEN-font-b-Movie-b-font-font-b-DVD-b-font-HD-font-b-CD.jpg"}}>
                </Image>

                <View style={{flex: .65, backgroundColor: "white"}}>
                    {this.props.account.role.role === "admin" &&
                    <View style={{flex: 1}}>
                        <CardItem button={true} onPress={() => this.onPressCart()}>
                            <Text>
                                Cart
                            </Text>
                        </CardItem>
                        <CardItem button={true} onPress={() => this.onPressDisc()}>
                            <Text>
                                CD/DVD
                            </Text>
                        </CardItem>
                        <CardItem button={true} onPress={() => this.onPressCategory()}>
                            <Text>
                                Category
                            </Text>
                        </CardItem>
                        <CardItem button={true} onPress={() => this.onPressProducer()}>
                            <Text>
                                Producer
                            </Text>
                        </CardItem>
                    </View>
                    }
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

export default connect(mapStateToProps, null)(SideBar);