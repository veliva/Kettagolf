import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, FlatList } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export default class TrainingCreationSreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            course: null,
            itselfAdded: true,
            players: [],
            playerIDs: [],
            player: null,
            playerName: null,
            itselfUID: null
        };
    }

    componentDidMount() {
        this.setState({
            course: this.props.navigation.state.params.course,
        })
        console.log('______________')

        const { currentUser } = firebase.auth()
        this.setState({itselfUID: currentUser.uid})
        this.addPlayer(currentUser.uid)
    }

    async removePlayer(userID) {
        await this.setState(prevState => ({
            players: prevState.players.filter(element => element.uid !== userID),
            playerIDs: prevState.playerIDs.filter(element => element !== userID)
        }));
        console.log(this.state.players)
        console.log(this.state.playerIDs)
    }

    async addPlayer(userID) {
        await this.userDataFromFirestore(userID)
        await this.imageFromFirebaseStorage(userID)

        await this.setState({
            players: [...this.state.players, this.state.player],
            playerIDs: [...this.state.playerIDs, this.state.player.uid],
            player: null
        });
        console.log(this.state.players)
        console.log(this.state.player)
        console.log(this.state.playerIDs)
    }

    async userDataFromFirestore(userID) {
		await firestore().collection('users').doc(userID).get()
		.then(snapshot => {
			// console.log(snapshot._data)
			const data = snapshot._data
            const name = data.firstName + ' ' + data.lastName
            const rating = data.rating
            this.setState({
                player: {
                    uid: userID,
                    fullName: name,
                    rating: rating,
                    imageURI: null
                }
            })
		})
		.catch(err => {
			console.log('Error getting documents', err);
        });
    }
    
    async imageFromFirebaseStorage(userID) {
		const imageRef = firebase.storage().ref('profilePictures').child(userID);
		await imageRef.getDownloadURL().then(result => {
			this.setState(prevState =>({
                player: {
                    ...prevState.player,
                    imageURI: result
                }
            }))
			// console.log(result)
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    searchUserByName = () => {
        if(this.state.playerName === null || this.state.playerName === '') {
            return
        }
        firestore().collection('users').where("fullName", "==", this.state.playerName).get()
		.then(snapshot => {
            if(snapshot._docs.length === 0) {
                Alert.alert(
                    'Tundmatu nimi',
                    'Sellise nimega mängijat pole andmebaasis.',
                    [
                      {text: '', },
                      {
                        text: '',
                      },
                      {text: 'OK', },
                    ],
                    {cancelable: false},
                );
            } else {
                // console.log(snapshot._docs[0].id)
                // console.log(snapshot._docs[0]._data)
                this.addPlayer(snapshot._docs[0].id)
                this.setState({playerName: null})
                if(snapshot._docs[0].id === this.state.itselfUID) {
                    this.setState({itselfAdded: true})
                }
            }
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }
    
    renderItem = ({item, index}) => {
        // console.log(JSON.stringify(item))
        return (
            <View style={styles.row}>
                <Avatar
                    rounded
                    source={{
                      uri: item.imageURI,
                    }}
                    containerStyle={{height: 100, width: 100}}
                />
                <View style={styles.rowName}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>{item.fullName}</Text>
                </View>
                <View style={styles.rowRating}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Rating: {item.rating}</Text>
                </View>
                <Button
                    containerStyle={{justifyContent: 'center'}}
                    buttonStyle={{backgroundColor: 'gray'}}
                    icon={
                        <MaterialIcon
                        name="close"
                        size={30}
                        color="red"
                        />
                    }
                    onPress = { () => {
                        Alert.alert(
                            'Eemalda kasutaja',
                            'Kas soovid mängija eemaldada?',
                            [
                              {text: 'Ei', onPress: () => console.log('Ei vajutatud')},
                              {
                                text: '',
                              },
                              {text: 'Jah', onPress: () => this.removePlayer(item.uid)},
                            ],
                            {cancelable: false},
                        );
                    }}
                />
                
            </View>
        );
    }

    render() {
        return(
            <View style={styles.container}>

                <View style={styles.courseContainer}>
                    <Text style={styles.courseText}>{this.state.course}</Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonsRow}>
                        <Input
                            placeholder='Mängija nimi'
                            containerStyle={{flex: 0.6, justifyContent: 'center'}}
                            autoCapitalize='words'
                            inputContainerStyle={styles.inputContainerStyle}
                            onChangeText={playerName => this.setState({ playerName })}
                            value={this.state.playerName}
                            onSubmitEditing={() => { this.searchUserByName() }}
                        />
                        <Button
                            title='Lisa mängija'
                            icon={
                                <MaterialIcon
                                name="person-add"
                                size={15}
                                color="white"
                                style = {{paddingRight: 10}}
                                />
                            }
                            containerStyle={{flex: 0.4, justifyContent: 'center'}}
                            onPress = { () => { this.searchUserByName() }}
                        />
                    </View>
                    
                    <View style={styles.buttonsRow}>
                        <Button
                            title='Lisa mind'
                            containerStyle={{flex: 1, marginRight: 2, justifyContent: 'center'}}
                            disabled={this.state.itselfAdded}
                            onPress={() => { 
                                this.setState({itselfAdded: true})
                                this.addPlayer(this.state.itselfUID)
                            }}
                        />
                        <Button
                            title='Eemalda mind'
                            containerStyle={{flex: 1, justifyContent: 'center'}}
                            disabled={!this.state.itselfAdded}
                            onPress={() => {
                                this.setState({itselfAdded: false})
                                this.removePlayer(this.state.itselfUID)
                            }}
                        />
                    </View>
                </View>

                <View style={styles.tableContainer}>

                    <FlatList 
                        style={styles.FlatList}
                        persistentScrollbar={true}
                        data={this.state.players}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                    />

                </View>

                <View style={styles.bottomContainer}>
                    <Button
                        title='Alusta'
                        containerStyle={{width: '30%'}}
                        icon={
                            <MaterialIcon
                                name="check"
                                size={20}
                                color="white"
                                style = {{paddingRight: 10}}
                            />
                        }
                        onPress={() => {
                            this.props.navigation.navigate('TrainingMarking', {
                                course: this.state.course,
                                players: this.state.players,
                                playerIDs: this.state.playerIDs,
                                upload: true
                            })
                        }}
                    />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    inputContainerStyle: {
        borderWidth: 2, 
        borderColor: 'gray', 
        borderRadius: 10,
    },
    courseContainer: {
        flex: 0.2,
        // borderWidth: 1,
        // borderColor: 'yellow',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tableContainer: {
        flex: 0.5,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        borderRadius: 10,
        width: '95%',
        alignSelf: 'center'
    },
    buttonsContainer: {
        flex: 0.2,
        flexDirection: 'column',
        width: '95%',
        alignSelf: 'center'
    },
    courseText: {
        fontWeight: 'bold',
        fontSize: 35
    },
    buttonsRow: {
        flexDirection: 'row', 
        width: '100%',
        flex: 1
    },
    FlatList: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#dbdbdb',
        borderRadius: 10,
        marginBottom: 2,
        padding: 3
    },
    rowName: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowRating: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomContainer: {
        flex: 0.1,
        alignItems: 'center'
    }
})