import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import Ionicon from 'react-native-vector-icons/Ionicons';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class MyResponse extends React.Component {

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
            myGroupSize: '',
            resComment: '',
            resStatus: '',
            resMyGroupSize: '',
            resDocID: '',
            trainingStart: true
        };
    }

    componentDidMount() {
        this.getResponse()

        this.imageFromFirebaseStorage(this.state.data.user)
        this.userDataFromFirestore(this.state.data.user)
    }

    userDataFromFirestore = (userID) => {
		firestore().collection('users').doc(userID).get()
		.then(snapshot => {
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
    
    getResponse = () => {
        const { currentUser } = firebase.auth()
		firestore().collection('adverts').doc(this.state.data.docID).collection('responses').where("responderID", "==", currentUser.uid).get()
		.then(snapshot => {
            const data = snapshot._docs[0]._data
            if(data.status === 'approved') {
                this.setState({
                    resComment: data.comment,
                    resStatus: data.status,
                    resMyGroupSize: data.myGroupSize,
                    resDocID: snapshot._docs[0].id,
                    trainingStart: false
                }, () => console.log(this.state.trainingStart))
            } else {
                this.setState({
                    resComment: data.comment,
                    resStatus: data.status,
                    resMyGroupSize: data.myGroupSize,
                    resDocID: snapshot._docs[0].id
                })
            }
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    statusText = () => {
        const { resStatus } = this.state
        if(resStatus === 'approved') {
            return <Text style={{fontWeight: 'bold', color: 'green'}}>Kinnitatud</Text>
        } else if(resStatus === 'rejected') {
            return <Text style={{fontWeight: 'bold', color: 'red'}}>Tagasi lükatud</Text>
        } else if(resStatus === 'waiting') {
            return <Text style={{fontWeight: 'bold', color: 'orange'}}>Vastuse ootel</Text>
        } else {
            return <Text></Text>
        }
    }
    
    // getUserResponsesFromFirestore = () => {
    //     const { currentUser } = firebase.auth()
    //     const ref = firestore().collectionGroup('responses').where("responderID", "==", currentUser.uid)
    //     ref.get()
	// 	.then(snapshot => {
    //         console.log('responderID____________________________')
    //         console.log(snapshot._docs.length)
	// 	})
	// 	.catch(err => {
	// 		console.log('Error getting documents', err);
	// 	});
    // }

    async imageFromFirebaseStorage(userID) {
		const imageRef = firebase.storage().ref('profilePictures').child(userID);
		await imageRef.getDownloadURL().then(result => {
			this.setState({fireStorageImageURI: result})
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    deleteResponse = () => {
        firestore().collection('adverts').doc(this.state.data.docID).collection('responses').doc(this.state.resDocID).delete()
        .then(() => {
            console.log("Document successfully deleted!");
            const { currentUser } = firebase.auth()
            firestore().collection('adverts').doc(this.state.data.docID).update({
                responses: firestore.FieldValue.arrayRemove(this.state.resDocID),
                responders: firestore.FieldValue.arrayRemove(currentUser.uid),
            })
            .then(() => {
                this.props.navigation.goBack(null)
            })
		})
		.catch(err => {
			console.log('Error removing document: ', err);
		});
    }

    startTraining = () => {
        const { currentUser } = firebase.auth()
        const { data } = this.state

        let approved = data.approved
        approved = approved.filter(arrayItem => arrayItem !== currentUser.uid);
        approved.push(data.user)
        this.props.navigation.popToTop()
        this.props.navigation.navigate('PlayerAdd', {
            course: data.course.name,
            approved: approved,
            advertDocID: data.docID
        })
    }

    render() {
        const { data } = this.state;
        return (
            <View style={styles.container}>

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

                    <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                        <Text style={{textAlign: 'left', alignSelf: 'center', fontWeight: 'bold', fontSize: 20, color: '#ffff', marginTop: 5}}>Minu vastus:</Text>

                        <TouchableOpacity 
                            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}
                            onPress={() => 
                                Alert.alert(
                                    'Kinnita',
                                    'Kas soovid vastuse kustutada?',
                                    [
                                        {text: 'Ei',},
                                        {text: '',},
                                        {text: 'Jah', onPress: () => {
                                                this.deleteResponse()
                                            }
                                        },
                                    ],
                                    {cancelable: false},
                                )
                            }
                        >
                            <Ionicon
                                name="ios-trash"
                                size={25}
                                color="red"
                                style = {{paddingRight: 10}}
                            />
                            <Text style={{textAlignVertical: 'center', color: 'red', fontWeight: 'bold', fontSize: 15}}>Kustuta</Text>
                        </TouchableOpacity>
                    </View>
                    
                    
                    <View style={{width: '95%', marginTop: 5}}>
                        <Text>Mitmekesi olen: {this.state.resMyGroupSize}</Text>
                        <Text>Kommentaar: {this.state.resComment}</Text>
                    </View>

                    <Text style={{textAlign: 'left', alignSelf: 'center', width: '100%', fontWeight: 'bold', fontSize: 20, color: '#ffff', marginTop: 5}}>Staatus: {this.statusText()}</Text>

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
                            title="Alusta treeningut"
                            disabled={this.state.trainingStart}
                            titleStyle={{color: '#4aaff7'}}
                            onPress={() => { this.startTraining() }}
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