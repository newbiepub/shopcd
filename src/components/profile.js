import React from "react";
import {View, Image, ScrollView} from "react-native";
import {Thumbnail, Text, Card, CardItem, Icon, ListItem, Label, Button, Container, Content} from "native-base";
import {connect} from "react-redux";
import {logout} from "../actions/login";

class Profile extends React.Component {
    constructor(props) {
        super(props)
    }

    editProfile() {
        this.props.navigator.push({
            id: "editprofile"
        })
    }

    render() {
        let profile = this.props.account.user.profile;
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                {profile != undefined &&
                <Image style={{flex: .35, alignItems: "center", justifyContent: "center"}}
                       source={{uri: "https://s-media-cache-ak0.pinimg.com/originals/8d/c2/da/8dc2da482b4eb1fbd60cf76c686be9ef.jpg"}}>
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        opacity: 0.3
                    }}/>

                    <Thumbnail large source={{uri: profile.picture}}/>

                </Image>
                }

                {profile != undefined &&
                <View style={{flex: .65}}>
                    <ScrollView>
                        <Card style={{padding: 10}}>
                            <CardItem header={true}>
                                <Icon name={"ios-person"}/>
                                <Text>
                                    {profile.name ? profile.name : ""}
                                </Text>
                            </CardItem>
                            <CardItem style={{flexDirection: "column", alignItems: "flex-start"}}>
                                <ListItem style={{borderBottomWidth: 0}}>
                                    <Label>Username</Label>
                                    <Text style={{marginLeft: 50}}>
                                        {this.props.account.user.username}
                                    </Text>
                                </ListItem>
                                <ListItem style={{borderBottomWidth: 0}}>
                                    <Label>Sex</Label>
                                    <Text style={{marginLeft: 50}}>
                                        {profile.sex ? "Male" : "Female"}
                                    </Text>
                                </ListItem>
                                <ListItem style={{borderBottomWidth: 0}}>
                                    <Label>Email</Label>
                                    <Text style={{marginLeft: 50}}>
                                        {profile.email ? profile.email : ""}
                                    </Text>
                                </ListItem>
                            </CardItem>
                            <CardItem footer={true}>
                                <Button rounded={true} onPress={this.editProfile.bind(this)}>
                                    <Text>
                                        Edit Profile
                                    </Text>
                                </Button>
                                <Button warning={true} rounded={true} style={{alignSelf: "flex-end", marginLeft: 40}}
                                        onPress={() => this.props.logout(this)}>
                                    <Text>
                                        Log Out
                                    </Text>
                                </Button>
                            </CardItem>
                        </Card>
                    </ScrollView>
                </View>
                }
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
    logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);