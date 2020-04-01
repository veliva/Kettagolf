import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, Picker, KeyboardAvoidingView } from 'react-native';
import { Avatar, Input, Button } from 'react-native-elements';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class Interested extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params.data,
            dateTime: this.props.navigation.state.params.dateTime,
            fireStorageImageURI: null,
            name: '',
            gender: '',
            country: '',
            pdgaNumber: '',
            comment: '',
            commentLength: 150,
            ownAd: false,
            myGroupSize: '',
        };
    }

    componentDidMount() {
        const { currentUser } = firebase.auth()
        if(this.state.data.user === currentUser.uid) {
            this.setState({ ownAd: true })
        }
        this.imageFromFirebaseStorage(this.state.data.user)
        this.userDataFromFirestore(this.state.data.user)
    }

    userDataFromFirestore = (userID) => {
		firestore().collection('users').doc(userID).get()
		.then(snapshot => {
			console.log(snapshot._data)
			const data = snapshot._data
			const nameFromDB = data.firstName + ' ' + data.lastName
			this.setState({
				name: nameFromDB,
				gender: data.gender,
				country: data.country,
				pdgaNumber: data.pdgaNumber,
			})
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
	}

    async imageFromFirebaseStorage(userID) {
		const imageRef = firebase.storage().ref('profilePictures').child(userID);
		await imageRef.getDownloadURL().then(result => {
			this.setState({fireStorageImageURI: result})
			// console.log(result)
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }
    
    addToFirestore = () => {
        const { currentUser } = firebase.auth()
        firestore().collection('adverts').doc(this.state.data.docID).collection('responses').add({
            status: 'waiting',
            seen: false,
            comment: this.state.comment,
            responderID: currentUser.uid,
            myGroupSize: this.state.myGroupSize
        })
        .then((docRef) => {
            firestore().collection('adverts').doc(this.state.data.docID).update({
                responses: firestore.FieldValue.arrayUnion(docRef.id),
                responders: firestore.FieldValue.arrayUnion(currentUser.uid)
            })
            .then(() => {})
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            Alert.alert(
                'Saadetud',
                'Vastus saadetud!',
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
        const { data } = this.state;
        return (
            <KeyboardAvoidingView style={styles.container} contentContainerStyle={styles.container} behavior="position" keyboardVerticalOffset={0}>

                <Text style={{textAlign: 'left', alignSelf: 'center', width: '95%', fontWeight: 'bold', fontSize: 20, color: '#ffff', marginTop: 5}}>Kuulutuse lisaja:</Text>
                <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center', marginTop: 5}}>
                    <Avatar
                        source={{
                            uri: this.state.fireStorageImageURI,
                        }}
                        style={{ flex: 0.26, aspectRatio: 1, resizeMode: 'contain', borderRadius: 20, overflow: "hidden", }}
                        containerStyle={{alignSelf: 'flex-start', flex: 0.3}}
                    />
                    
                    <View style={{flexDirection: 'column', flex: 0.7, justifyContent: 'center', paddingLeft: 10}}>
                        <Text style={{fontWeight: 'bold', fontSize: 18, flex: 1, textAlignVertical: 'center', textAlign: 'left'}}>{this.state.name}</Text>
                        <Text style={{textAlignVertical: 'bottom', textAlign: 'left',}}>Riik: {this.state.country}</Text>
                        <Text style={{textAlign: 'left', textAlignVertical: 'bottom'}}>Sugu: {this.state.gender}</Text>
                        <Text style={{textAlign: 'left', textAlignVertical: 'bottom'}}>PDGA#: {this.state.pdgaNumber}</Text>
                    </View>
                </View>

                <Text style={{textAlign: 'left', alignSelf: 'center', width: '95%', fontWeight: 'bold', fontSize: 20, color: '#ffff', marginTop: 5}}>Kuulutuse andmed:</Text>
                <View style={{width: '95%', marginTop: 5}}>
                    <Text>Aeg: {this.state.dateTime}</Text>
                    <Text>Pargi nimi: {data.course.name}</Text>
                    <Text>Pargi asukoht: {data.course.location}, {data.course.county}</Text>
                    <Text>Mitut mängijat otsib: {data.lookingGroupSize}</Text>
                    <Text>Mitmekesi on: {data.myGroupSize}</Text>
                    <Text>Kommentaar: {data.comment}</Text>
                </View>

                <View style={{width: '95%', borderTopColor: 'gray', borderTopWidth: 1, marginTop: 5}}>
                    <View style={{flexDirection: 'row', width: '95%', marginTop: 5, alignSelf: 'center', alignItems: 'center'}}>
                        <Text style={{textAlignVertical: 'center', textAlign: 'left', fontWeight: 'bold', color: '#ffff', fontSize: 18, flex: 0.5}}>Mitmekesi oled? </Text>
                        <Picker
                            selectedValue={this.state.myGroupSize}
                            style={{flex: 0.5}}
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

                    <Input
                        label={'Kommentaar: '}
                        multiline={true}
                        maxLength={150}
                        value={this.state.comment}
                        disabled={this.state.ownAd}
                        onChangeText={text => {
                            const maxLength = 150;
                            this.setState({
                                commentLength: maxLength - text.length,
                                comment: text
                            });
                        }}
                        containerStyle={{width: '100%', alignSelf: 'center', marginTop: 10}}
                    />
                    <Text style={{textAlign: 'right', width: '95%'}}>{this.state.commentLength}</Text>

                </View>

                <View style={{width: '95%', flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>

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
                            title="Tagasi"
                            titleStyle={{color: '#4aaff7'}}
                            onPress={() => this.props.navigation.goBack(null) }
                        />

                        <Button
                            buttonStyle={styles.button}
                            containerStyle={{flex: 1, width: '100%', alignItems: 'center'}}
                            title="Kinnita"
                            disabled={this.state.ownAd}
                            titleStyle={{color: '#4aaff7'}}
                            onPress={() => 
                                Alert.alert(
                                    'Kinnita',
                                    'Kinnitad soovi kuulutusele vastata?',
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

            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#9ed6ff',
        width: '100%'
    },
    avatarView: {
		alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: 'red',
        borderRadius: 50
    },
    button: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#ffff',
        borderRadius: 20,
        width: '85%'
    },
  })