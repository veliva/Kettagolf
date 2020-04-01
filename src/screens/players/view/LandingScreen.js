import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Picker, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Switch } from 'react-native-paper';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import CountryPicker from '../../../components/CountryPicker'

export default class LandingScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            wishes: [],
            showNotActive: false,
            country: '',
            yesterdayDate: Date.now() -1,
            date: Date.now(),
            showDatePicker: false,
            inputDate: '',
            beginningDate: null,
            endingDate: null,
            endingDate2: null,
            userid: null,
        };
    }

    async componentDidMount() {
        await this.calculateDate()
        await this.getUserCountry()

        this.navFocusListener = await this.props.navigation.addListener(
            'didFocus',
            param => {
                console.log('didFocus Landing')
                this.getWishesFromFirestore();
            }
        );
        const { currentUser } = firebase.auth()
        this.setState({ userid: currentUser.uid})
    }

    componentWillUnmount() {
        this.navFocusListener.remove()
    }

    calculateDate = () => {
        console.log("calculateDate: " + this.state.date)
        const ms = this.state.date;
        const msPerDay = 86400 * 1000;
        const beginning = ms - (ms % msPerDay);
        const ending = beginning + (msPerDay-1)
        const ending2 = beginning + 86400000 -1

        this.setState({
            beginningDate: beginning,
            endingDate: ending,
            endingDate2: ending2,
        }, () => this.timeConverter(this.state.date))
    }

    timeConverter(UNIX_timestamp) {
        const a = new Date(UNIX_timestamp);
        const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        const year = a.getFullYear();
        const month = months[a.getMonth()];
        let date = a.getDate();
        if(date < 10) {
            date = '0' + date
        }
        const date2 = String(date + '/' + month + '/' + year)
        this.setState({
            inputDate: date2
        })
        if(this.state.country !== '') {
            this.getWishesFromFirestore()
        }
    }

    changeDateTime = (pickedDateTime) => {
        if(pickedDateTime.nativeEvent.timestamp !== undefined) {
            this.timeConverter(pickedDateTime.nativeEvent.timestamp)
            console.log("dateChanged: " + pickedDateTime.nativeEvent.timestamp)
            this.setState({ 
                date: pickedDateTime.nativeEvent.timestamp, 
                showDatePicker: false,
            }, () => {this.calculateDate()})
        } else {
            return
        }
    }

    getUserCountry = () => {
        const { currentUser } = firebase.auth()
        firestore().collection('users').doc(currentUser.uid).get()
        .then(snapshot => {
            const data = snapshot._data
            this.setState({ country: data.country }, () => this.getWishesFromFirestore())
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    getResponse(result){
        this.setState({country: result.name}, () => this.getWishesFromFirestore());
    }

    onToggleSwitch = () => {
        this.setState(state => ({ showNotActive: !state.showNotActive }), () => this.getWishesFromFirestore())
    }

    getWishesFromFirestore = () => {
        let query = firestore().collection('adverts')
        if(this.state.showNotActive) {
            query = query.where("country", "==", this.state.country)
        } else {
            query = query.where("country", "==", this.state.country).where("active", "==", true)
        }
        query = query.where("date", ">=", this.state.beginningDate).where("date", "<=", this.state.endingDate)
        query = query.orderBy("date", "asc")
        query.get()
		.then(snapshot => {
            this.setState({ wishes: [] })
            if(snapshot._docs.length === 0) {
                console.log('huvitav lugu, tühi')
            } else {
                let tempArray = []
                for(let i=0; i<snapshot._docs.length; i++) {
                    tempArray.push(snapshot._docs[i]._data)
                    tempArray[i].docID = snapshot._docs[i].id
                    
                    // console.log("getWishesDatabase " + snapshot._docs[i]._data.date)
                }
                this.setState({ wishes: tempArray})
                // console.log(tempArray)
            }
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    timeConverter2(UNIX_timestamp) {
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

    renderItem = ({item, index}) => {
        // console.log(item)
        let activeText = ""
        let color = ""
        let backgroundColor = "#9ed6ff"
        const dateTime = this.timeConverter2(item.date)
        if(item.active) {
            activeText = "Aktiivne"
            color = "green"
        } else {
            activeText = "Mitteaktiivne"
            color = "red"
        }
        if(item.user === this.state.userid) {
            backgroundColor = "#9eecff"
        }
        return(
            <View style={[styles.row, {backgroundColor}]}>
                <TouchableOpacity 
                    style={{width: '100%', marginLeft: 5}}
                    onPress={() => this.props.navigation.navigate('Interested', {data: item, dateTime: dateTime})}
                >
                    <Text style={{fontWeight: 'bold'}}>{item.course.name}</Text>
                    <Text>{item.course.location}, {item.course.county}</Text>
                    <Text>{dateTime}</Text>
                    <Text style={{fontWeight: 'bold', color}}>{activeText}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={{width: '100%', alignItems: 'center'}}>

                    <CountryPicker
                        country={this.state.country}
                        callback={this.getResponse.bind(this)}
                    />

                    <TouchableOpacity 
                        onPress={() => this.setState({ showDatePicker: true }, console.log(this.state.date))}
                    >
                        <Input
                            label='Kuupäev:'
                            placeholder='Kuupäev'
                            disabled={true}
                            value={this.state.inputDate}
                            leftIcon={() => {
                                return <MaterialCommunityIcon name='calendar' size={20} color="black" />;
                            }}
                            disabledInputStyle={{opacity: 1}}
                            containerStyle={{marginTop: 10, marginBottom: 10}}
                            inputContainerStyle={styles.inputContainerStyle}
                            labelStyle={styles.inputLabelStyle}
                            inputStyle={styles.inputStyle}
                        />
                    </TouchableOpacity>

                    <View style={{flexDirection: 'row', width: '85%', height: 40, marginBottom: 5}}>

                        <Text style={{flex: 1, fontWeight: 'bold', fontSize: 18, textAlignVertical: 'center'}}>Kuva mitteaktiivsed:</Text>

                        <Switch
                            value={this.state.showNotActive}
                            onValueChange={this.onToggleSwitch}
                            style={{flex: 1}}
                        />

                    </View>

                </View>

                <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 5, color: '#ffff', textAlign: 'left', width: '95%'}}>Kuulutused:</Text>

                <FlatList
                    data={this.state.wishes}
                    persistentScrollbar={true}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.FlatList}
                />

                {this.state.showDatePicker && (
                    <DateTimePicker 
                        value={this.state.date}
                        mode='date'
                        display='default'
                        // minimumDate={this.state.yesterdayDate}
                        onChange={ dateTime => {this.setState({showDatePicker: false}), this.changeDateTime(dateTime)}}
                    />
                )}

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
})