import React from "react";
import {View} from "react-native";
import {List, Spinner, ListItem, Text, Thumbnail, Button, Icon, Body} from "native-base";
import {connect} from "react-redux";
import styleIndicator from "./style/indicator"
import {getCollection} from "../actions/data";

class Collection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 15
        }
    }


    componentWillMount() {
        setTimeout(() => {
            this.props.getCollection(this.props.data.collection, this.state.limit);
        }, 500);
    }

    renderDisc(item) {
        return (
            <View style={{flexDirection: "row"}}>
                <Thumbnail square size={80} source={{uri: item.image}}/>
                <Body>
                <Text>{item.title}</Text>
                <Text note numberOfLines={3}>{item.summary}</Text>
                </Body>
            </View>
        )
    }

    renderCategory(item) {
        return (
            <Text>
                {item.name}
            </Text>
        )
    }

    renderProducer(item) {
        return (
            <Text>
                {item.producerName}
            </Text>
        )
    }

    renderCart(item) {

    }

    onEndReached() {
        let limit = this.state.limit;
        limit += 15;
        this.setState({limit});
        setTimeout(() => {
            this.props.getCollection(this.props.data.collection, limit);
        }, 500)
    }

    collectionItem(item) {
        this.props.navigator.push({
            id: `edit${this.props.data.collection}`,
            data: {
                id: item.id,
                instance: this
            },
            type: "update"
        })
    }

    renderItem(item) {
        return (
            <ListItem onPress={() => this.collectionItem(item)}>
                {this.props.data.collection === "cd" &&
                this.renderDisc(item)
                }
                {this.props.data.collection === "category" &&
                this.renderCategory(item)
                }
                {this.props.data.collection === "producer" &&
                this.renderProducer(item)
                }
            </ListItem>
        )
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: "white"}}>
                {
                    this.props.collectionData.length ?
                        <List
                            dataArray={this.props.collectionData}
                            onEndReached={this.onEndReached.bind(this)}
                            renderRow={this.renderItem.bind(this)}
                        />
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
        collectionData: state.diskData.data
    }
};

const mapDispatchToProps = {
    getCollection
};


export default connect(mapStateToProps, mapDispatchToProps)(Collection);