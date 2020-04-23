import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, FlatList, TouchableOpacity, Modal } from 'react-native';
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
            responses: [],
            images: [{uid: null, uri: null}],
            users: [],
            comment: '',
            myGroupSize: '',
            resComment: '',
            resStatus: '',
            resMyGroupSize: '',
            resDocID: '',
            modalVisible: false,
            modalItem: {},
            modalImageRef: {},
            modalUsersRef: {},
        };
    }

    componentDidMount() {
        this.getImages()
        this.userDataFromFirestore()
        this.getResponses()
    }

    setModalVisible = (visible, item, imageRef, usersRef) => {
        if(visible) {
            this.setState({ 
                modalVisible: visible,
                modalItem: item,
                modalImageRef: imageRef,
                modalUsersRef: usersRef,
            });
        } else {
            this.setState({ 
                modalVisible: visible,
                modalItem: {},
                modalImageRef: {},
                modalUsersRef: {},
            });
        }
    }

    userDataFromFirestore = () => {
        const { data } = this.state
        let tempArray = []
        for(let i=0; i < data.responders.length; i++) {
            firestore().collection('users').doc(data.responders[i]).get()
            .then(snapshot => {
                const data = snapshot._data
                const nameFromDB = data.firstName + ' ' + data.lastName
                const obj = {
                    name: nameFromDB,
                    gender: data.gender,
                    country: data.country,
                    pdgaNumber: data.pdgaNumber,
                    uid: this.state.data.responders[i]
                }
                tempArray.push(obj)
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
        }
        this.setState({ users: tempArray })
	}

    async getImages() {
        const { data } = this.state
        let tempArray = []
        for(let i=0; i < data.responses.length; i++) {
            const imageRef = firebase.storage().ref('profilePictures').child(data.responders[i]);
            await imageRef.getDownloadURL().then(result => {
                const obj = {
                    uri: result,
                    uid: data.responders[i]
                }
                tempArray.push(obj)
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
        }
        this.setState({ images: tempArray })
    }

    async getResponses() {
        const { data } = this.state
        let tempArray = []
        for(let i=0; i < data.responses.length; i++) {
            await firestore().collection('adverts').doc(this.state.data.docID).collection('responses').doc(data.responses[i]).get()
            .then(snapshot => {
                snapshot._data.docID = data.responses[i]
                tempArray.push(snapshot._data)
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
        }
        tempArray.sort((a,b) => a.seen - b.seen)
        this.setState({responses: tempArray})
    }

    changeStatus = (status, item) => {
        let ref = firestore().collection('adverts').doc(this.state.data.docID)
        let obj = {}
        if(status === 'approved') {
            obj = { approved: firestore.FieldValue.arrayUnion(item.responderID) }
        }else if(status === 'rejected') {
            obj = { approved: firestore.FieldValue.arrayRemove(item.responderID) }
        }else if(status === 'waiting') {
            obj = { approved: firestore.FieldValue.arrayRemove(item.responderID) }
        }
        ref.update(obj)
        .then(() => {
            firestore().collection('adverts').doc(this.state.data.docID).get()
            .then((snapshot) => {
                let test = this.state.data
                test.approved = snapshot._data.approved
                this.setState({ data: test })
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

        firestore().collection('adverts').doc(this.state.data.docID).collection('responses').doc(item.docID).update({
            status: status,
            seen: true
        })
        .then(() => {this.getResponses()})
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }

    deleteAdvert = () => {
        firestore().collection('adverts').doc(this.state.data.docID).delete()
        .then(() => {
            firestore().collection('adverts').doc(this.state.data.docID).collection('responses').get()
            .then((snapshot) => {
                const docs = snapshot._docs
                if(docs.length !== 0) {
                    for(let i=0; i<docs.length; i++) {
                        firestore().collection('adverts').doc(this.state.data.docID).collection('responses').doc(docs[i].id).delete()
                        .then(() => {})
                        .catch(function(error) {
                            console.error("Error deleting subcollection's document: ", error);
                        });
                    }
                }
            })
            .catch(function(error) {
                console.error("Error reading document: ", error);
            });
            this.props.navigation.goBack(null)
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }

    changeActive = () => {
        firestore().collection('adverts').doc(this.state.data.docID).update({
            active: !this.state.data.active
        })
        .then(() => {
            let test = this.state.data
            test.active = !test.active
            this.setState({ data: test })
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }

    statusText = (resStatus) => {
        if(resStatus === 'approved') {
            return <Text style={{fontWeight: 'bold', color: 'green'}}>Kinnitatud</Text>
        } else if(resStatus === 'rejected') {
            return <Text style={{fontWeight: 'bold', color: 'red'}}>Tagasi lükatud</Text>
        } else if(resStatus === 'waiting') {
            return <Text style={{fontWeight: 'bold', color: 'orange'}}>Ootel</Text>
        } else {
            return <Text></Text>
        }
    }

    renderItem = ({item, index}) => {
        // console.log(item)
        let imageRef = {uid: null, uri: null}
        let imageRefUri = null
        let usersRef = {
            name: null,
            gender: null,
            country: null,
            pdgaNumber: null,
            uid: null
        }
        
        if(this.state.images.length > 0) {
            imageRef = this.state.images.find(o => o.uid === item.responderID);
            console.log("!!!!imageRef typeof: "+typeof(imageRef))
            usersRef = this.state.users.find(o => o.uid === item.responderID);
            if(imageRef === undefined) {
                return
            } else if(imageRef !== undefined) {
                imageRefUri = imageRef.uri
            }
        }

        let backgroundColor = "#7dc6fa"
        let fontWeight = "normal"
        if(!item.seen) {
            backgroundColor = "#59baff"
            fontWeight = "bold"
        }

        return(
            <View style={styles.row}>
                <TouchableOpacity
                    style={{width: '100%', marginLeft: 5, backgroundColor}}
                    onPress={() => {
                        this.setModalVisible(true, item, imageRef, usersRef);
                      }}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                        <View style={{flexDirection: 'column', flex: 0.75, justifyContent: 'center'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 18, flex: 1, textAlignVertical: 'center', textAlign: 'left'}}>{usersRef.name}</Text>
                            <Text style={{textAlignVertical: 'bottom', textAlign: 'left', fontWeight}}>Riik: {usersRef.country}</Text>
                            <Text style={{textAlign: 'left', textAlignVertical: 'bottom', fontWeight}}>Sugu: {usersRef.gender}</Text>
                            <Text style={{textAlign: 'left', textAlignVertical: 'bottom', fontWeight}}>PDGA#: {usersRef.pdgaNumber}</Text>
                            <Text style={{flex: 1, fontWeight}}>Mitmekesi on: {item.myGroupSize}</Text>
                        </View>
                        
                        <Avatar
                            source={{
                                uri: imageRefUri,
                            }}
                            style={{ flex: 0.20, aspectRatio: 1, resizeMode: 'contain', borderRadius: 20, overflow: "hidden", }}
                        />
                        
                    </View>
                    
                    <Text style={{flex: 1, fontWeight}}>Kommentaar: {item.comment}</Text>
                    <Text style={{flex: 1, fontWeight: 'bold', width: '95%', borderTopWidth: 1, borderTopColor: 'gray'}}>Olek: {this.statusText(item.status)}</Text>

                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const { data } = this.state;
        const { modalVisible } = this.state;
        let activeText = ""
        if(data.active) {
            activeText = <Text style={{fontWeight: 'bold', color: 'green'}}>Aktiivne</Text>
        } else {
            activeText = <Text style={{fontWeight: 'bold', color: 'red'}}>Mitteaktiivne</Text>
        }
        return (
            <View style={styles.container}>
                <Text style={{textAlign: 'left', alignSelf: 'center', width: '95%', fontWeight: 'bold', fontSize: 20, color: '#ffff', marginTop: 5}}>Kuulutuse andmed:</Text>
                <View style={{width: '95%', marginTop: 5}}>
                    <Text>Aeg: {this.state.dateTime}</Text>
                    <Text>Pargi nimi: {data.course.name}</Text>
                    <Text>Pargi asukoht: {data.course.location}, {data.course.county}</Text>
                    <Text>Mitut mängijat otsib: {data.lookingGroupSize}</Text>
                    <Text>Mitmekesi on: {data.myGroupSize}</Text>
                    <Text>Kommentaar: {data.comment}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                        <Text style={{fontWeight: 'bold'}}>Olek: {activeText}</Text>
                        <TouchableOpacity style={{marginLeft: 15}} onPress={() => this.changeActive()}>
                            <Text style={{fontWeight: 'bold', color: '#000000', fontSize: 16, textAlignVertical: 'center'}}>Muuda olekut</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}
                            onPress={() => 
                                Alert.alert(
                                    'Kinnita',
                                    'Kas soovid kuulutuse kustutada?',
                                    [
                                        {text: 'Ei',},
                                        {text: '',},
                                        {text: 'Jah', onPress: () => {
                                                this.deleteAdvert()
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
                </View>

                <Text style={{textAlign: 'left', alignSelf: 'center', width: '95%', fontWeight: 'bold', fontSize: 20, color: '#ffff'}}>Vastused:</Text>

                <FlatList
                    data={this.state.responses}
                    persistentScrollbar={true}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.FlatList}
                />

                <View style={{width: '95%', flexDirection: 'row', justifyContent: 'center', marginBottom: 20}}>

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
                        titleStyle={{color: '#4aaff7'}}
                        onPress={() => { 
                            this.props.navigation.popToTop()
                            this.props.navigation.navigate('PlayerAdd', {
                                course: data.course.name,
                                approved: data.approved,
                                advertDocID: data.docID
                            }) 
                        } }
                    />
                </View>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            
                            <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                                <View style={{flexDirection: 'column', flex: 0.75, justifyContent: 'center'}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 18, textAlignVertical: 'center', textAlign: 'left'}}>{this.state.modalUsersRef.name}</Text>
                                    <Text style={{textAlignVertical: 'bottom', textAlign: 'left',}}>Riik: {this.state.modalUsersRef.country}</Text>
                                    <Text style={{textAlign: 'left', textAlignVertical: 'bottom'}}>Sugu: {this.state.modalUsersRef.gender}</Text>
                                    <Text style={{textAlign: 'left', textAlignVertical: 'bottom'}}>PDGA#: {this.state.modalUsersRef.pdgaNumber}</Text>
                                    <Text>Mitmekesi on: {this.state.modalItem.myGroupSize}</Text>
                                </View>

                                <Avatar
                                    source={{
                                        uri: this.state.modalImageRef.uri,
                                    }}
                                    style={{ flex: 0.20, aspectRatio: 1, resizeMode: 'contain', borderRadius: 20, overflow: "hidden", }}
                                />
                            
                            </View>
                        
                            <Text>Kommentaar: {this.state.modalItem.comment}</Text>
                            <Text style={{fontWeight: 'bold', width: '100%', borderTopWidth: 1, borderTopColor: 'gray'}}>Olek: {this.statusText(this.state.modalItem.status)}</Text>
                            
                            <View style={{flexDirection: 'row', width: '95%', alignItems: 'center', marginTop: 12}}>
                                <TouchableOpacity
                                    style={{ flex: 1, alignItems: 'center' }}
                                    onPress={() => {
                                        this.changeStatus('rejected', this.state.modalItem)
                                        this.setModalVisible(!modalVisible);
                                    }}
                                >
                                    <Text style={{color: 'red', fontWeight: 'bold', fontSize: 18}}>Keeldu</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flex: 1, alignItems: 'center' }}
                                    onPress={() => {
                                        this.changeStatus('waiting', this.state.modalItem)
                                        this.setModalVisible(!modalVisible);
                                    }}
                                >
                                    <Text style={{color: 'orange', fontWeight: 'bold', fontSize: 18}}>Ootele</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ flex: 1, alignItems: 'center' }}
                                    onPress={() => {
                                        this.changeStatus('approved', this.state.modalItem)
                                        this.setModalVisible(!modalVisible);
                                    }}
                                >
                                    <Text style={{color: 'green', fontWeight: 'bold', fontSize: 18}}>Nõustu</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#9ed6ff',
        width: '100%'
    },
    button: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#ffff',
        borderRadius: 20,
        width: '85%'
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(112, 112, 112, 0.7)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "#c7e7ff",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '95%'
    },
})