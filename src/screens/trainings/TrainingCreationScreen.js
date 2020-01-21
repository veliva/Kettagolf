import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default class TrainingCreationSreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            course: null,
        };
    }

    getCourseDataFromFirestore = () => {
		firestore().collection('courses').doc(this.state.course).get()
		.then(snapshot => {
            console.log(snapshot._data)
            if(snapshot._data === undefined) {
                Alert.alert(
                    'Tundmatu rada',
                    'Sellise nimega rada pole andmebaasis. Kas soovid selle lisada?',
                    [
                      {text: 'Ei', onPress: () => console.log('Ei vajutatud')},
                      {
                        text: '',
                      },
                      {text: 'Jah', onPress: () => this.props.navigation.navigate('CourseCreation', {course: this.state.course})},
                    ],
                    {cancelable: false},
                );
            }
			// const data = snapshot._data
			// const nameFromDB = data.firstName + ' ' + data.lastName
			// this.setState({
			// 	name: nameFromDB,
			// 	gender: data.gender,
			// 	country: data.country,
			// 	rating: data.rating,
			// 	pdgaNumber: data.pdgaNumber
			// })
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
	}

    render() {
           
        return (
            <View style={styles.container}>
                <Text>Treeningu tegemine toimub siin!</Text>
                <TextInput
                    placeholder="Rada"
                    autoCapitalize="sentences"
                    style={styles.textInput}
                    onChangeText={course => this.setState({ course })}
                    value={this.state.course}
                />
                <TouchableOpacity 
                    style = {styles.button}
                    onPress = {() => this.getCourseDataFromFirestore()}
                >
                    <Text>Alusta</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    },
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#4293f5',
        borderRadius: 8
    }
})