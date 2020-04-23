import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, FlatList } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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
            itselfUID: null,
            advertDocID: null
        };
    }

    async componentDidMount() {
        this.setState({
            course: this.props.navigation.state.params.course,
        })
        console.log('______________')

        const { currentUser } = firebase.auth()
        this.setState({itselfUID: currentUser.uid})
        await this.addPlayer(currentUser.uid)

        if(this.props.navigation.state.params.approved !== undefined) {
            const test = this.props.navigation.state.params.approved
            for(let i=0; i < test.length; i++ ) {
                await this.addPlayer(test[i])
            }
        }

        if(this.props.navigation.state.params.advertDocID !== undefined) {
            this.setState({ advertDocID: this.props.navigation.state.params.advertDocID })
        }
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
        console.log(this.state.playerIDs)
        console.log(this.state.player)
    }

    async userDataFromFirestore(userID) {
		await firestore().collection('users').doc(userID).get()
		.then(snapshot => {
			// console.log(snapshot._data)
			const data = snapshot._data
            const name = data.firstName + ' ' + data.lastName
            this.setState({
                player: {
                    uid: userID,
                    fullName: name,
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

    async addTempPlayer() {
        await this.setState({
            player: {
                uid: 'temp ' + this.state.playerName,
                fullName: this.state.playerName,
                imageURI: 'https://firebasestorage.googleapis.com/v0/b/kettagolf-d21a1.appspot.com/o/profilePictures%2FtempAvatar.png?alt=media&token=ff8626a0-9b86-4971-b5df-a831c2e91b88'
            }
        })

        if(this.state.players.some(player => player.uid === this.state.player.uid)){
            this.setState({ player: null })
            Alert.alert(
                'Mängija juba olemas',
                'Sellise nimega ajutine mängija on juba lisatud.',
                [
                    {text: '', },
                    {
                      text: '',
                    },
                    {text: 'Ok', },
                ],
                  {cancelable: false},
            )
        } else {
            await this.setState({
                players: [...this.state.players, this.state.player],
                playerIDs: [...this.state.playerIDs, this.state.player.uid],
                player: null
            });
        }
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
                    'Sellise nimega mängijat pole andmebaasis. Kas soovid sisestatud nimega registreerimata mängija treeningusse lisada?',
                    [
                      {text: 'Ei', },
                      {
                        text: '',
                      },
                      {text: 'Jah', onPress: () => { this.addTempPlayer() }},
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
                    containerStyle={{height: 65, width: 65}}
                />

                <View style={styles.rowName}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>{item.fullName}</Text>
                </View>

                <Button
                    containerStyle={{justifyContent: 'center'}}
                    buttonStyle={{backgroundColor: '#c9e8ff'}}
                    icon={
                        <MaterialIcon
                        name="close"
                        size={20}
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

                <View style={styles.buttonsRow}>
                    <Input
                        placeholder='Mängija nimi'
                        containerStyle={{flex: 0.6, justifyContent: 'center'}}
                        autoCapitalize='words'
                        onChangeText={playerName => this.setState({ playerName })}
                        value={this.state.playerName}
                        onSubmitEditing={() => { this.searchUserByName() }}
                        inputContainerStyle={styles.inputContainerStyle}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
                    />
                    <Button
                        title='Lisa mängija'
                        titleStyle={{color: '#4aaff7'}}
                        icon={
                            <MaterialIcon
                            name="person-add"
                            size={15}
                            color="#4aaff7"
                            style = {{paddingRight: 10}}
                            />
                        }
                        containerStyle={{flex: 0.4}}
                        buttonStyle={styles.button}
                        onPress = { () => { this.searchUserByName() }}
                    />
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
                        titleStyle={{color: '#4aaff7'}}
                        containerStyle={{width: '90%', alignItems: 'center'}}
                        buttonStyle={styles.button}
                        onPress={() => {
                            if(this.state.advertDocID !== null) {
                                firestore().collection('adverts').doc(this.state.advertDocID).update({ active: false })
                                .then(() => {})
                                .catch(function(error) {
                                    console.error("Error writing document: ", error);
                                });
                            }
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
        backgroundColor: '#9ed6ff',
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
        color: '#ffff',
    },
    courseContainer: {
        flex: 0.2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tableContainer: {
        flex: 0.6,
        width: '90%',
        alignSelf: 'center'
    },
    courseText: {
        fontWeight: 'bold',
        fontSize: 35
    },
    buttonsRow: {
        flexDirection: 'row', 
        width: '90%',
        flex: 0.15,
        alignItems: 'center',
        alignSelf: 'center',
    },
    FlatList: {
        width: '100%',
        backgroundColor: '#b3dfff',
        borderRadius: 5
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'flex-start',
        backgroundColor: '#4aaff7',
        borderRadius: 10,
        marginBottom: 2,
        padding: 3
    },
    rowName: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 25
    },
    bottomContainer: {
        flex: 0.15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        padding: 12,
        backgroundColor: '#ffff',
        borderRadius: 20,
        width: '100%'
    },
})