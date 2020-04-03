import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Picker, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class AdditionalInfo extends React.Component {

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
            back: false,
            comment: '',
            commentLength: 150
        };
    }

    componentDidMount() {
        if(this.props.navigation.state.params.back) {
            this.setState({
                course: this.props.navigation.state.params.course,
                country: this.props.navigation.state.params.country,
                back: this.props.navigation.state.params.back,
                yesterdayDate: this.props.navigation.state.params.yesterdayDate,
                date: this.props.navigation.state.params.date,
                inputDate: this.props.navigation.state.params.inputDate,
                inputTime: this.props.navigation.state.params.inputTime,
                myGroupSize: this.props.navigation.state.params.myGroupSize,
                lookingGroupSize: this.props.navigation.state.params.lookingGroupSize,
                comment: this.props.navigation.state.params.comment,
                commentLength: this.props.navigation.state.params.commentLength,
            }, () => this.timeConverter(this.state.date))
        } else {
            this.setState({
                course: this.props.navigation.state.params.course,
                country: this.props.navigation.state.params.country,
                back: this.props.navigation.state.params.back
            })
            this.timeConverter(this.state.date)
        }
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

    navigateBack = () => {
        this.props.navigation.state.params.returnData(
            true,
            this.state.yesterdayDate,
            this.state.date,
            this.state.inputDate,
            this.state.inputTime,
            this.state.myGroupSize,
            this.state.lookingGroupSize,
            this.state.comment,
            this.state.commentLength,
        );
        this.props.navigation.goBack();
    }

    addToFirestore = () => {
        const { currentUser } = firebase.auth()
        firestore().collection('adverts').add({
            course: this.state.course,
            country: this.state.country,
            date: this.state.date,
            myGroupSize: this.state.myGroupSize,
            lookingGroupSize: this.state.lookingGroupSize,
            comment: this.state.comment,
            user: currentUser.uid,
            active: true,
            responses: [],
            responders: [],
            seen: true,
            approved: []
        })
        .then(() => {
            Alert.alert(
                'Lisatud',
                'Kuulutus lisatud!',
                [
                    {text: '',},
                    {text: '',},
                    {text: 'OK', onPress: () => {
                            this.props.navigation.popToTop()
                        }
                    },
                ],
                {cancelable: false},
            )
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }

    render() {
        return (
            <View style={styles.container}>

                    <View style={{flexDirection: 'row', width: '90%'}}>
                        <TouchableOpacity 
                            onPress={() => this.setState({ showDatePicker: true }, console.log(this.state.date))}
                            style={{flex: 0.6}}
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
                        <TouchableOpacity 
                            onPress={() => this.setState({ showTimePicker: true }, console.log(this.state.date))}
                            style={{flex: 0.4}}
                        >
                            <Input
                                label='Kellaaeg:'
                                placeholder='Kellaaeg'
                                disabled={true}
                                value={this.state.inputTime}
                                leftIcon={() => {
                                    return <MaterialCommunityIcon name='clock' size={20} color="black" />;
                                }}
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
                    
                    <View style={{flexDirection: 'column', width: '90%', marginTop: 10}}>
                        <Text style={{textAlignVertical: 'center', textAlign: 'center', fontWeight: 'bold', color: '#ffff', fontSize: 18}}>Mitmekesi oled? </Text>
                        <Picker
                            selectedValue={this.state.myGroupSize}
                            style={{width: '50%', alignSelf: 'center'}}
                            onValueChange={(itemValue, itemIndex) => this.setState({ myGroupSize: itemValue })}
                            prompt={'Mitmekesi oled?'}
                        >
                            <Picker.Item label="-Vali-" value="" />
                            <Picker.Item label="Üksi" value="Üksi" />
                            <Picker.Item label="Kahekesi" value="Kahekesi" />
                            <Picker.Item label="Kolmekesi" value="Kolmekesi" />
                            <Picker.Item label="Neljakesi" value="Neljakesi" />
                            <Picker.Item label="Viiekesi" value="Viiekesi" />
                            <Picker.Item label="Rohkem kui viiekesi" value="Rohkem kui viiekesi" />
                        </Picker>
                    </View>

                    <View style={{flexDirection: 'column', width: '90%', marginTop: 10}}>
                        <Text style={{textAlignVertical: 'center', textAlign: 'center', fontWeight: 'bold', color: '#ffff', fontSize: 18}}>Mitut mängijat otsid? </Text>
                        <Picker
                            selectedValue={this.state.lookingGroupSize}
                            style={{width: '50%', alignSelf: 'center'}}
                            onValueChange={(itemValue, itemIndex) => this.setState({ lookingGroupSize: itemValue })}
                            prompt={'Mitut mängijat otsid?'}
                        >
                            <Picker.Item label="-Vali-" value="" />
                            <Picker.Item label="Eelistus puudub" value="0" />
                            <Picker.Item label="Ühte" value="Ühte" />
                            <Picker.Item label="Kahte" value="Kahte" />
                            <Picker.Item label="Kolme" value="Kolme" />
                            <Picker.Item label="Nelja" value="Nelja" />
                            <Picker.Item label="Viite" value="Viite" />
                            <Picker.Item label="Rohkem kui viite" value="Rohkem kui viite" />
                        </Picker>
                    </View>

                <Input
                    label={'Kommentaar: '}
                    multiline={true}
                    maxLength={150}
                    value={this.state.comment}
                    onChangeText={text => {
                        const maxLength = 150;
                        this.setState({
                            commentLength: maxLength - text.length,
                            comment: text
                        });
                    }}
                    containerStyle={{width: '90%', alignSelf: 'center', marginTop: 10}}
                />
                <Text style={{textAlign: 'right', width: '85%'}}>{this.state.commentLength}</Text>

                <View style={{width: '90%', flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>

                    <Button
                        icon={
                            <Ionicon
                            name="ios-arrow-back"
                            size={25}
                            color="#4aaff7"
                            style = {{paddingRight: 10}}
                            />
                        }
                        buttonStyle={styles.button}
                        containerStyle={{flex: 1, width: '100%', alignItems: 'center'}}
                        title="Asukoht"
                        titleStyle={{color: '#4aaff7'}}
                        onPress={() => this.navigateBack()}
                    />

                    <Button
                        buttonStyle={styles.button}
                        containerStyle={{flex: 1, width: '100%', alignItems: 'center'}}
                        title="Kinnita"
                        titleStyle={{color: '#4aaff7'}}
                        onPress={() => 
                            Alert.alert(
                                'Kinnita',
                                'Kinnitad andmed ja lisad kuulutuse?',
                                [
                                    {text: 'Ei',},
                                    {text: '',},
                                    {text: 'Jah', onPress: () => {
                                            this.addToFirestore()
                                        }
                                    },
                                ],
                                {cancelable: false},
                            )
                        }
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
        color: '#ffff',
    },
    button: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#ffff',
        borderRadius: 20,
        width: '90%'
    },
})