import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { Input, Button } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import CountryPicker from './../../components/CountryPicker'

export default class EditData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '', 
            password: '',
            userID: '',
            firstName: '',
            lastName: '',
            fullName: '',
            gender: 'Mees',
            birthYear: '',
            country: '',
            pdgaNumber: null,
        };
    }

    componentDidMount() {
        this.getUserData()
    }

    getUserData = () => {
        const { currentUser } = firebase.auth()
        this.setState({ userID: currentUser.uid })
        firestore().collection('users').doc(currentUser.uid).get()
		.then(snapshot => {
			console.log(snapshot._data)
			const data = snapshot._data
			this.setState({
				firstName: data.firstName,
				lastName: data.lastName,
				country: data.country,
				pdgaNumber: data.pdgaNumber,
			})
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    addToFirestore = () => {
        firestore().collection('users').doc(this.state.userID).update({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            country: this.state.country,
            pdgaNumber: this.state.pdgaNumber,
        })
        .then(() => {
            Alert.alert(
                'Muudetud',
                'Andmed muudetud!',
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

    getResponse(result){
        this.setState({country: result.name}, () => this.getCoursesFromFirestoreByCountry(result.name));
    }

    updateFullName = (first, last) => {
        const test = first + ' ' + last
        this.setState({fullName: test})
    }
  
    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>

                <Input
                    label='Eesnimi:'
                    placeholder="Eesnimi"
                    autoCapitalize="words"
                    leftIcon={() => {
                        return <MaterialIcon name='account-circle' size={20} color="#ffff" />;
                    }}
                    onChangeText={firstName => { this.setState({ firstName }), this.updateFullName(firstName, this.state.lastName)}}
                    value={this.state.firstName}
                    inputContainerStyle={styles.inputContainerStyle}
                    containerStyle={{marginTop: 10, width: '90%'}}
                    labelStyle={styles.inputLabelStyle}
                    inputStyle={styles.inputStyle}
                />
                <Input
                    label='Perekonnanimi:'
                    placeholder="Perekonnanimi"
                    autoCapitalize="words"
                    leftIcon={() => {
                        return <MaterialIcon name='account-circle' size={20} color="#ffff" />;
                    }}
                    onChangeText={lastName => { this.setState({ lastName }), this.updateFullName(this.state.firstName ,lastName)}}
                    value={this.state.lastName}
                    inputContainerStyle={styles.inputContainerStyle}
                    containerStyle={{marginTop: 10, width: '90%'}}
                    labelStyle={styles.inputLabelStyle}
                    inputStyle={styles.inputStyle}
                />

                <Input
                    label='PDGA number:'
                    placeholder="PDGA number"
                    style={styles.textInput}
                    onChangeText={pdgaNumber => this.setState({ pdgaNumber })}
                    value={this.state.pdgaNumber}
                    keyboardType='numeric'
                    containerStyle={{marginTop: 10, width: '90%'}}
                    inputContainerStyle={styles.inputContainerStyle}
                    labelStyle={styles.inputLabelStyle}
                    inputStyle={styles.inputStyle}
                />

                <CountryPicker
                    country={this.state.country}
                    callback={this.getResponse.bind(this)}
                />

                <Button
                    // icon={
                    //     <Ionicon
                    //     name="ios-checkmark"
                    //     size={25}
                    //     color="#4aaff7"
                    //     style = {{paddingRight: 10}}
                    //     />
                    // }
                    buttonStyle={styles.button}
                    containerStyle={{flex: 1, width: '90%', alignItems: 'center', marginTop: 20}}
                    title="Muuda"
                    titleStyle={{color: '#4aaff7'}}
                    onPress={() => 
                        Alert.alert(
                            'Kinnita',
                            'Kas kinnitad soovi andmed muuta?',
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

            </ScrollView>
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
    button: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#ffff',
        borderRadius: 20,
        width: '95%'
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#4aaff7',
        borderRadius: 8,
    },
    inputLabelStyle: {
        color: '#ffff', 
        marginBottom: 5,
    },
    inputStyle: {
        color: '#ffff'
    },
})