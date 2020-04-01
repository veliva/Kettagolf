import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { FAB } from 'react-native-paper';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class UserWishes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userWishes: [],
            selectedIndex: 0
        };
        this.updateIndex = this.updateIndex.bind(this)
    }

    updateIndex (selectedIndex) {
        this.setState({selectedIndex, userWishes: []}, () => this.getUserWishesFromFirestore())
    }

    componentDidMount() {
        this.getUserWishesFromFirestore()

        this.navFocusListener = this.props.navigation.addListener(
            'didFocus',
            param => {
                console.log('didFocus UserWishes')
                this.getUserWishesFromFirestore();
            }
        );
    }

    componentWillUnmount() {
        this.navFocusListener.remove()
    }

    getUserWishesFromFirestore = () => {
        const { currentUser } = firebase.auth()
        const { selectedIndex } = this.state
        let query = firestore().collection('adverts')
        if(selectedIndex === 0) {
            query = query.where("responders", "array-contains", currentUser.uid)
        } else if(selectedIndex === 1) {
            query = query.where("user", "==", currentUser.uid)
        }
        query.get()
		.then(snapshot => {
            this.setState({ userWishes: [] })
            if(snapshot._docs.length === 0) {
                console.log('huvitav lugu, tühi')
            } else {
                let tempArray = []
                for(let i=0; i<snapshot._docs.length; i++) {
                    tempArray.push(snapshot._docs[i]._data)
                    tempArray[i].docID = snapshot._docs[i].id
                }
                this.setState({ userWishes: tempArray})
                console.log(tempArray)
            }
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    getUserResponsesFromFirestore = () => {
        const { currentUser } = firebase.auth()
        const ref = firestore().collectionGroup('responses').where("responderID", "==", currentUser.uid)
        ref.get()
		.then(snapshot => {
            console.log('responderID____________________________')
            console.log(snapshot._docs[0].id)
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    timeConverter(UNIX_timestamp) {
        const a = new Date(UNIX_timestamp);
        const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        const year = a.getFullYear();
        const month = months[a.getMonth()];
        let date = a.getDate();
        let hour = a.getHours();
        let min = a.getMinutes();
        if(hour < 10) {
            hour = '0' + hour
        }
        if(min < 10) {
            min = '0' + min
        }
        if(date < 10) {
            date = '0' + date
        }
        const time = date + '.' + month + '.' + year + ' ' + hour + ':' + min ;
        return time
    }

    navigate = (item, dateTime) => {
        const { selectedIndex } = this.state
        if(selectedIndex === 0) {
            this.props.navigation.navigate('MyResponse', {data: item, dateTime: dateTime})
        } else if(selectedIndex === 1) {
            // this.props.navigation.navigate('MyAdded', {data: item, dateTime: dateTime})
        }
    }

    renderItem = ({item, index}) => {
        let activeText = ""
        let color = ""
        let approvedText = ""
        const dateTime = this.timeConverter(item.date)
        const responsesLength = item.responses.length
        const { currentUser } = firebase.auth()
        if(item.active) {
            activeText = "Aktiivne"
            color = "green"
        } else {
            activeText = "Mitteaktiivne"
            color = "red"
        }
        if(item.approved.includes(currentUser.uid)) {
            approvedText = "Kinnitatud"
        }
        
        let highlightedText = ""
        let highlightedColor = {color: "orange"}
        let backgroundColor = "#7dc6fa"
        let fontWeight = "normal"
        if(this.state.selectedIndex === 0 && item.active) {highlightedText = "Vastuse ootel"}
        if(!item.seen) {
            highlightedText = "Uus teade"
            backgroundColor = "#59baff"
            fontWeight = "bold"
            highlightedColor = {color: "red"}
        }
        return(
            <View style={[styles.row, {backgroundColor}]}>
                <TouchableOpacity 
                    style={{width: '100%', marginLeft: 5}}
                    onPress={() => this.navigate(item, dateTime)}
                >
                    <Text style={{fontWeight: 'bold'}}>{item.course.name}</Text>
                    <Text style={{fontWeight}}>{item.course.location}, {item.course.county}</Text>
                    <Text style={{fontWeight}}>{dateTime}</Text>
                    {this.state.selectedIndex === 1 ? <Text style={{fontWeight}}>Vastuseid: {responsesLength}</Text> : null}
                    <Text style={{fontWeight: 'bold', color}}>{activeText} <Text style={{fontWeight: 'bold', color: 'orange'}}>{approvedText}</Text> <Text style={[{fontWeight: 'bold'}, highlightedColor]}>{highlightedText}</Text></Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const buttons = ['Vastused', 'Lisatud']
        const { selectedIndex } = this.state
        return (
            <View style={styles.container}>

                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
                    containerStyle={{height: 40, marginTop: 10, marginBottom: 10}}
                    selectedButtonStyle={{backgroundColor: 'white'}}
                    buttonStyle={{backgroundColor: '#b5b5b5'}}
                    textStyle={{color: '#525252'}}
                    selectedTextStyle={{color: '#525252'}}
                />

                <View style={{flex: 1, width: '100%', alignItems: 'center'}}>

                    <FlatList
                        data={this.state.userWishes}
                        persistentScrollbar={true}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.FlatList}
                    />

                </View>

                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => this.props.navigation.navigate('CourseSelection') }
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#9ed6ff',
        width: '100%',
    },
    FlatList: {
        backgroundColor: '#b3dfff',
        flex: 1,
        width: '95%',
        borderRadius: 5
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 5,
        margin: 2,
        backgroundColor: '#7dc6fa',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})