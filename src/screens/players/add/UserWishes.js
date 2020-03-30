import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Picker, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class UserWishes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userWishes: [],
        };
    }

    componentDidMount() {
        this.getUserWishesFromFirestore()

        this.navFocusListener = this.props.navigation.addListener(
            'didFocus',
            param => {
                console.log('didFocus Landing')
                this.getUserWishesFromFirestore();
            }
        );
    }

    componentWillUnmount() {
        this.navFocusListener.remove()
    }

    getUserWishesFromFirestore = () => {
        const { currentUser } = firebase.auth()
        firestore().collection('searchAds').where("user", "==", currentUser.uid).get()
		.then(snapshot => {
            this.setState({ userWishes: [] })
            if(snapshot._docs.length === 0) {
                console.log('huvitav lugu, tühi')
            } else {
                let tempArray = []
                for(let i=0; i<snapshot._docs.length; i++) {
                    tempArray.push(snapshot._docs[i]._data)
                }
                this.setState({ userWishes: tempArray})
                // console.log(tempArray)
            }
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    renderItem = ({item, index}) => {
        // console.log(item)
        let activeText = ""
        let color = ""
        if(item.active) {
            activeText = "Aktiivne"
            color = "green"
        } else {
            activeText = "Mitteaktiivne"
            color = "red"
        }
        return(
            <View style={styles.row}>
                <TouchableOpacity style={{width: '100%', marginLeft: 5}}>
                    <Text>{item.course.name}</Text>
                    <Text>{item.course.location}, {item.course.county}</Text>
                    <Text>Vastuseid: 0</Text>
                    <Text style={{fontWeight: 'bold', color}}>{activeText}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={{flex: 1, width: '90%'}}>

                    <Button
                        buttonStyle={styles.button}
                        containerStyle={{flex: 1, width: '100%', alignItems: 'center'}}
                        title="Lisa kuulutus"
                        titleStyle={{color: '#4aaff7'}}
                        onPress={ () => this.props.navigation.navigate('CourseSelection') }
                    />

                </View>

                <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 5, color: '#ffff', textAlign: 'left', width: '90%'}}>Minu kuulutused:</Text>

                <FlatList
                    data={this.state.userWishes}
                    // persistentScrollbar={true}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    // ListHeaderComponent={this.renderHeader}
                    style={styles.FlatList}
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
    inputContainerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#4aaff7',
        borderRadius: 8,
        width: '90%',
        alignItems: 'center',
    },
    inputLabelStyle: {
        color: '#ffff', 
        marginBottom: 5,
    },
    inputStyle: {
        color: '#ffff',
    },
    button: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#ffff',
        borderRadius: 20,
        width: '90%'
    },
    FlatList: {
        backgroundColor: '#b3dfff',
        flex: 1,
        width: '90%',
        borderRadius: 5
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 5,
        margin: 2,
        backgroundColor: '#7dc6fa',
    },
})