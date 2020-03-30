import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Input, Button, Tooltip } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import CountryPicker from '../../../components/CountryPicker'

export default class CourseSelection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            country: '',
            course: null,
            courses: [],
            back: false,
            yesterdayDate: Date.now(),
            date: Date.now(),
            inputDate: '',
            inputTime: '',
            myGroupSize: '',
            lookingGroupSize: '',
            comment: '',
            commentLength: 150
        };
    }

    componentDidMount() {
        this.getUserCountry()
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

    _choosen(selectedItem) {
        this.setState({ course: selectedItem });
    }

    navigate = () => {
        if(this.state.course === null) {
            Alert.alert(
                'Park valimata',
                'Andmete sisestamiseks tuleb kõigepealt valida park.'
            )
        } else {
            if(this.state.back) {
                this.props.navigation.navigate('AdditionalInfo', {
                    country: this.state.country,
                    course: this.state.course,
                    back: this.state.back,
                    yesterdayDate: this.state.yesterdayDate,
                    date: this.state.date,
                    inputDate: this.state.inputDate,
                    inputTime: this.state.inputTime,
                    myGroupSize: this.state.myGroupSize,
                    lookingGroupSize: this.state.lookingGroupSize,
                    comment: this.state.comment,
                    commentLength: this.state.commentLength,
                    returnData: this.returnData.bind(this)
                })
            } else {
                this.props.navigation.navigate('AdditionalInfo', {
                    country: this.state.country,
                    course: this.state.course,
                    back: this.state.back,
                    returnData: this.returnData.bind(this)
                })
            }
        }
    }

    returnData(
        back,
        yesterdayDate,
        date,
        inputDate,
        inputTime,
        myGroupSize,
        lookingGroupSize,
        comment,
        commentLength
    ) {
        this.setState({
            back: back,
            yesterdayDate: yesterdayDate,
            date: date,
            inputDate: inputDate,
            inputTime: inputTime,
            myGroupSize: myGroupSize,
            lookingGroupSize: lookingGroupSize,
            comment: comment,
            commentLength: commentLength,
        });
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
                <EvilIcon name='question' size={30} color="gray" />
            </Tooltip>
        </View>
    }

    renderItem = ({item, index}) => {
        const isSelected = (this.state.course === item);

        const backgroundColor = isSelected ? "#2ba7ff" : "#7dc6fa";
        const fontWeight = isSelected ? "bold" : "normal";

        return(
            <View style={[styles.row, {backgroundColor}]}>
                <TouchableOpacity
                    onPress={() => this._choosen(item)}
                    style={{width: '100%'}}
                >
                    <Text style={{fontWeight, fontSize: 18, marginLeft: 5, fontWeight: 'bold'}}>{item.name}</Text>
                    <Text style={{fontWeight, fontSize: 15, marginLeft: 5}}>{item.location}, {item.county}</Text>
                    <Text style={{fontWeight, fontSize: 15, marginLeft: 5}}>{item.numberOfBaskets} rada</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>

                <CountryPicker
                    country={this.state.country}
                    callback={this.getResponse.bind(this)}
                />

                <FlatList
                    data={this.state.courses}
                    persistentScrollbar={true}
                    stickyHeaderIndices={[0]}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={this.renderHeader}
                    style={styles.FlatList}
                />

                <View style={{width: '90%', flexDirection: 'row', justifyContent: 'center', flex: 0.2}}>

                <Button
                    icon={
                        <Ionicon
                        name="md-close"
                        size={25}
                        color="#4aaff7"
                        style = {{paddingRight: 10}}
                        />
                    }
                    buttonStyle={styles.button}
                    containerStyle={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}
                    title="Tühista"
                    titleStyle={{color: '#4aaff7'}}
                    onPress={() => this.props.navigation.goBack()}
                />

                <Button
                    icon={
                        <Ionicon
                        name="ios-arrow-forward"
                        size={25}
                        color="#4aaff7"
                        style = {{paddingLeft: 10}}
                        />
                    }
                    iconRight={true}
                    buttonStyle={styles.button}
                    containerStyle={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}
                    title="Andmed"
                    titleStyle={{color: '#4aaff7'}}
                    onPress={() => this.navigate()}
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
        fontSize: 20, 
        color: '#ffff'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 5,
        margin: 2,
    },
  })