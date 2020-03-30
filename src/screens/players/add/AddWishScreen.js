import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Picker } from 'react-native';
import { Input, Button, Tooltip } from 'react-native-elements';
import Ionicon from 'react-native-vector-icons/Ionicons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import CountryPicker from '../../../components/CountryPicker'

export default class AddWishScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            country: '',
            course: null,
            courses: [],
            yesterdayDate: Date.now() -1,
            date: Date.now(),
            showDatePicker: false,
            showTimePicker: false,
            inputDate: '',
            inputTime: '',
            myGroupSize: '',
            lookingGroupSize: '',
        };
    }

    componentDidMount() {
        this.getUserCountry()
        this.timeConverter(this.state.date)
    }

    getUserCountry = () => {
        const { currentUser } = firebase.auth()
        firestore().collection('users').doc(currentUser.uid).get()
        .then(snapshot => {
            const data = snapshot._data
			this.setState({ country: data.country })
            this.getCoursesFromFirestoreByCountry(data.country)
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    getResponse(result){
        this.setState({country: result.name}, () => this.getCoursesFromFirestoreByCountry(result.name));
    }

    getCoursesFromFirestoreByCountry(country) {
        firestore().collection('courses').where("country", "==", country).orderBy('name').get()
		.then(snapshot => {
            this.setState({ courses: [] })
            if(snapshot._docs.length === 0) {
                console.log('huvitav lugu, tühi')
            } else {
                let tempArray = []
                for(let i=0; i<snapshot._docs.length; i++) {
                    tempArray.push(snapshot._docs[i]._data)
                }
                this.setState({ courses: tempArray})
                // console.log(tempArray)
            }
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    timeConverter(UNIX_timestamp) {
        console.log('timestamp: ' + UNIX_timestamp)
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
        const date2 = String(date + '/' + month + '/' + year)
        const time = String(hour + ':' + min)
        console.log(date2)
        console.log(time)
        this.setState({
            inputDate: date2,
            inputTime: time
        })
    }

    changeDateTime = (pickedDateTime) => {
        if(pickedDateTime.nativeEvent.timestamp !== undefined) {
            this.timeConverter(pickedDateTime.nativeEvent.timestamp)
            this.setState({ 
                date: pickedDateTime.nativeEvent.timestamp, 
                showDatePicker: false,
                showTimePicker: false,
            })
        } else {
            return
        }
    }

    _choosen(selectedItem) {
        this.setState({ course: selectedItem });
    }

    renderHeader = () => {
        return <View style = {styles.header}>
            <Text style={styles.headerText}>
                Vali park:
            </Text>
            <Tooltip 
                popover={
                    <Text>Parke saab juurde lisada treeningu loomisel.</Text>
                }
                height={50}
            >
                <EvilIcon name='question' size={25} color="gray" />
            </Tooltip>
        </View>
    }

    renderItem = ({item, index}) => {
        const isSelected = (this.state.course === item);

        const backgroundColor = isSelected ? "#ffff" : "#b3dfff";
        const fontWeight = isSelected ? "bold" : "normal";

        return(
            <View>
                <TouchableOpacity
                    onPress={() => this._choosen(item)}
                    style={{width: '100%', backgroundColor}}
                >
                    <Text style={{fontWeight, fontSize: 16}}>{item.name}</Text>
                    <Text style={{fontWeight, fontSize: 13}}>{item.location}, {item.county}</Text>
                    <Text style={{fontWeight, fontSize: 13}}>{item.numberOfBaskets} rada</Text>
                </TouchableOpacity>
            </View>
        )
    }

    ItemSeparator = () => {
        return (
            <View style={{height: 2, width: '100%', backgroundColor: 'gray'}}/>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 0.8, width: '100%', alignItems: 'center', backgroundColor: 'red'}}>
                    <CountryPicker
                        country={this.state.country}
                        callback={this.getResponse.bind(this)}
                        style={{flex: 1}}
                    />

                    <View style={{flexDirection: 'row', width: '90%', flex: 1}}>
                        <TouchableOpacity 
                            onPress={() => this.setState({ showDatePicker: true }, console.log(this.state.date))}
                            style={{flex: 0.6}}
                        >
                            <Input
                                label='Kuupäev:'
                                placeholder='Kuupäev'
                                disabled={true}
                                value={this.state.inputDate}
                                disabledInputStyle={{opacity: 1}}
                                containerStyle={{marginTop: 10, marginBottom: 10}}
                                inputContainerStyle={styles.inputContainerStyle}
                                labelStyle={styles.inputLabelStyle}
                                inputStyle={styles.inputStyle}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.setState({ showTimePicker: true }, console.log(this.state.date))}
                            style={{flex: 0.4}}
                        >
                            <Input
                                label='Kellaaeg:'
                                placeholder='Kellaaeg'
                                disabled={true}
                                value={this.state.inputTime}
                                disabledInputStyle={{opacity: 1}}
                                containerStyle={{marginTop: 10, marginBottom: 10}}
                                inputContainerStyle={styles.inputContainerStyle}
                                labelStyle={styles.inputLabelStyle}
                                inputStyle={styles.inputStyle}
                            />
                        </TouchableOpacity>
                    </View>

                    {this.state.showDatePicker && (
                        <DateTimePicker 
                            value={this.state.date}
                            mode='date'
                            display='default'
                            minimumDate={this.state.yesterdayDate}
                            onChange={ dateTime => {this.setState({showDatePicker: false}), this.changeDateTime(dateTime)}}
                        />
                    )}
                    {this.state.showTimePicker && (
                        <DateTimePicker 
                            value={this.state.date}
                            mode='time'
                            display='default'
                            minuteInterval={5}
                            is24Hour={true}
                            onChange={ dateTime => {this.setState({showTimePicker: false}), this.changeDateTime(dateTime)}}
                        />
                    )}
                    
                    <View style={{flexDirection: 'row', width: '90%', flex: 1}}>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text style={{textAlignVertical: 'center', flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#ffff', fontSize: 16}}>Olen: </Text>
                            <Picker
                                selectedValue={this.state.myGroupSize}
                                style={{ flex: 1, width: '90%', alignSelf: 'flex-end'}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ myGroupSize: itemValue })}
                                prompt={'Mitmekesi oled?'}
                            >
                                <Picker.Item label="-Vali-" value="" />
                                <Picker.Item label="Üksi" value="1" />
                                <Picker.Item label="Kahekesi" value="2" />
                                <Picker.Item label="Kolmekesi" value="3" />
                                <Picker.Item label="Neljakesi" value="4" />
                                <Picker.Item label="Viiekesi" value="5" />
                                <Picker.Item label="Kuuekesi" value="6" />
                                <Picker.Item label="Seitsmekesi" value="7" />
                                <Picker.Item label="Kaheksakesi" value="8" />
                                <Picker.Item label="Üheksakesi" value="9" />
                                <Picker.Item label="Kümnekesi või enam" value="10" />
                            </Picker>
                        </View>
                        
                        <View style={{justifyContent: 'center'}}>
                            <Tooltip 
                                popover={
                                    <Text>Mängijate arvu valimine aitab kuidagi.</Text>
                                }
                                height={50}
                            >
                                <EvilIcon name='question' size={28} color="gray" />
                            </Tooltip>
                        </View>

                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text style={{textAlignVertical: 'center', flex: 1, textAlign: 'center', fontWeight: 'bold', color: '#ffff', fontSize: 16}}>Otsin: </Text>
                            <Picker
                                selectedValue={this.state.lookingGroupSize}
                                style={{ flex: 1, width: '90%', alignSelf: 'flex-end'}}
                                onValueChange={(itemValue, itemIndex) => this.setState({ lookingGroupSize: itemValue })}
                                prompt={'Mitut mängijat otsid?'}
                            >
                                <Picker.Item label="-Vali-" value="" />
                                <Picker.Item label="Eelistus puudub" value="0" />
                                <Picker.Item label="Ühte" value="1" />
                                <Picker.Item label="Kahte" value="2" />
                                <Picker.Item label="Kolme" value="3" />
                                <Picker.Item label="Nelja" value="4" />
                                <Picker.Item label="Viite" value="5" />
                                <Picker.Item label="Kuute" value="6" />
                                <Picker.Item label="Seitset" value="7" />
                                <Picker.Item label="Kaheksat" value="8" />
                                <Picker.Item label="Üheksat" value="9" />
                                <Picker.Item label="Kümmet või enamat" value="10" />
                            </Picker>
                        </View>
                    </View>
                </View>

                <FlatList
                    data={this.state.courses}
                    persistentScrollbar={true}
                    stickyHeaderIndices={[0]}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={this.renderHeader}
                    ItemSeparatorComponent={this.ItemSeparator}
                    style={styles.FlatList}
                />

                <View style={{flex: 0.5, width: '100%', justifyContent: 'flex-start'}}>

                    <Input
                        label='Kommentaar:'
                        multiline={true}
                        containerStyle={{width: '90%', alignSelf: 'center'}}
                    />

                    <Button
                        icon={
                            <Ionicon
                            name="ios-add-circle"
                            size={15}
                            color="#4aaff7"
                            style = {{paddingRight: 10}}
                            />
                        }
                        buttonStyle={styles.button}
                        containerStyle={{flex: 0.4, width: '100%', alignItems: 'center'}}
                        title="Lisa"
                        titleStyle={{color: '#4aaff7'}}
                        onPress={() => console.log(this.state.date)}
                    />
                </View>

            </View>
        );
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
        color: '#ffff'
    },
    FlatList: {
        backgroundColor: '#b3dfff',
        width: '90%',
        flex: 1,
        borderRadius: 5,
        marginTop: 10
    },
    header: {
        backgroundColor: '#9ed6ff',
        flexDirection: 'row',
        flex: 1
    },
    button: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#ffff',
        borderRadius: 20,
        width: '90%'
    },
    headerText: {
        flex: 1,
        textAlign: 'left', 
        fontWeight: 'bold', 
        fontSize: 17, 
        color: '#ffff'
    }
  })