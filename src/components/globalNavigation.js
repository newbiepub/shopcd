import React from "react";
import {View, Navigator, BackAndroid} from "react-native";
import {Header, Left, Right, Button, Body, Text, Icon, Drawer, Badge} from "native-base";
import {connect} from "react-redux";
import Login from "./login";
import Home from "./home";
import Detail from "./detail";
import Profile from "./profile";
import Collection from "./collections";
import Sidebar from "./sidebar";
import EditCD from "./edit/cd";
import EditCategory from "./edit/category";
import EditProducer from "./edit/producer";
import Search from "./search";
import EditProfile from "./edit/profile";
import SignUp from "./signup";
import Cart from "./cart";
import Checkout from "./checkout";
import Payment from "./payment";

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this._navigator = null;
    }

    componentWillMount() {

    }

    renderScene(route, navigator) {
        this._navigator = navigator;

        switch (route.id) {
            case "login":
                return (<Login navigator={navigator}/>);
            case "home":
                return (<Home navigator={navigator}/>);
            case "detail":
                return (<Detail navigator={navigator} data={route.data}/>);
            case "profile":
                return (<Profile navigator={navigator}/>);
            case "collection":
                return (
                    <Collection navigator={navigator} data={route.data}/>
                );
            case "editcd":
                return (<EditCD navigator={navigator} collectionData={route.data} type={route.type}/>);
            case "editcategory":
                return (<EditCategory navigator={navigator} collectionData={route.data} type={route.type}/>);
            case "editproducer":
                return (<EditProducer navigator={navigator} collectionData={route.data} type={route.type}/>);
            case "search":
                return (<Search navigator={navigator}/>);
            case "editprofile":
                return (<EditProfile navigator={navigator}/>);
            case "signup":
                return (<SignUp navigator={navigator}/>);
            case "cart":
                return (<Cart navigator={navigator}/>);
            case "checkout":
                return (<Checkout navigator={navigator}/>);
            case "payment":
                return (<Payment navigator={navigator}/>);
        }
    }

    componentDidMount() {
        /**
         * Back Android
         */
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (this.state.route.index !== 0) {
                this._navigator.pop();
                return true;
            } else {
                return true;
            }
        });
    }

    onBackNavigation() {
        this._navigator.pop();
    }

    onWillFocus(route) {
        this.setState({route});
    }

    onLogin() {
        if (this.state.route.id !== "login") {
            this._navigator.push({
                id: "login"
            })
        }
    }

    onNavigateToProfile() {
        if (this.state.route.id !== "profile") {
            this._navigator.push({
                id: "profile"
            })
        }
    }

    closeDrawer() {
        this.drawer._root.close()
    }

    openDrawer = () => {
        this.drawer._root.open()
    };

    onSearch() {
        this._navigator.push({
            id: "search"
        })
    }

    goToCart() {
        this._navigator.push({
            id: "cart"
        })
    }

    render() {
        return (
            <Drawer
                ref={(ref) => { this.drawer = ref; }}
                content={<Sidebar navigator={this._navigator} drawer={this.drawer}/>}
                onClose={this.closeDrawer.bind(this)}>
                <View style={{flex: 1}}>
                    {
                        (this.state != null && this.state.route.id !== "search") &&
                        <Header>
                            <Left>
                                {
                                    !this.props.account.loginState ?
                                        <Button transparent onPress={this.onBackNavigation.bind(this)}>
                                            <Icon name="ios-arrow-back-outline"/>
                                        </Button>
                                        :
                                        <Button transparent onPress={this.openDrawer.bind(this)}>
                                            <Icon name="menu"/>
                                        </Button>
                                }

                            </Left>
                            <Body>
                            <Text>
                                SHOPCD
                            </Text>
                            </Body>
                            <Right>
                                {
                                    this.props.account.loginState ?
                                        <View style={{flexDirection: "row"}}>
                                            {this.props.account.role.role !== "admin" &&
                                            <Button transparent={true} onPress={this.goToCart.bind(this)}>
                                                <Badge fontSize={10}><Text>{this.props.cartNumber}</Text></Badge>
                                                <Icon name={"ios-cart-outline"}/>
                                            </Button>
                                            }
                                            <Button transparent={true} onPress={this.onSearch.bind(this)}>
                                                <Icon name={"ios-search-outline"}/>
                                            </Button>
                                            <Button transparent={true} onPress={this.onNavigateToProfile.bind(this)}>
                                                <Icon name="ios-person"/>
                                            </Button>
                                        </View>
                                        :
                                        <Button transparent onPress={this.onLogin.bind(this)}>
                                            <Icon name="ios-log-in-outline"/>
                                        </Button>
                                }

                            </Right>
                        </Header>
                    }
                    <Navigator
                        ref={(navigator)=>{
                            this._navigator = navigator;
                        }
                    }
                        initialRoute={{id: "home", index: 0}}
                        renderScene={this.renderScene.bind(this)}
                        onWillFocus={this.onWillFocus.bind(this)}
                    />

                </View>
            </Drawer>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        account: state.account,
        cartNumber: state.diskData.cartItem
    }
};

export default connect(mapStateToProps, null)(Navigation);