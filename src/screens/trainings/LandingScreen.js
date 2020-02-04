import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class LandingScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            trainings: [],
            tracksArr: [],
            tracks: null
        }
    }

    componentDidMount() {
        console.log('didMount')

        this.props.navigation.addListener(
            'didFocus',
            param => {
                this.getTrainingsFromFirestore();
            }
        );

        this.getTrainingsFromFirestore()
    }

    async getTrainingsFromFirestore() {
        await this.setState({ tracksArr: [] })
        const { currentUser } = firebase.auth()
        await firestore().collection('trainings').where("playerIDs", "array-contains", currentUser.uid).orderBy('creationTime', 'desc').get()
        .then(async(querySnapshot) => {
            console.log(`Received query snapshot of size ${querySnapshot.size}`);
            if(querySnapshot._docs.length > 0) {
                let arr = []
                for(var i=0; i<querySnapshot._docs.length; i++)  {
                    let element = querySnapshot._docs[i]._data
                    element.trainingid = querySnapshot._docs[i].id
                    await this.tracksFromFirestore(element.courseid)
                    element.tracks = this.state.tracks
                    element.formatedCreationTime = this.timeConverter(element.creationTime)
                    arr.push(element);
                }
                this.setState({trainings: arr})
            }
        }, err => {
            console.log(`Encountered error: ${err}`);
        });
    }

    async tracksFromFirestore(courseid){
        console.log('tracksFromFirestore')
        await firestore().collection('courses').where(firebase.firestore.FieldPath.documentId(), '==', courseid).get()
		.then(snapshot => {
            this.setState({ tracks: snapshot._docs[0]._data.tracks })
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    getCourseDataFromFirestore = (trainingid) => {
		firestore().collection('courses').doc(trainingid).get()
		.then(snapshot => {
            this.setState({
                tracks: snapshot._docs[0]._data.tracks,
                courseid: snapshot._docs[0].id
            })
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    timeConverter(UNIX_timestamp) {
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
        const time = date + '.' + month + '.' + year + ' ' + hour + ':' + min ;
        return time
    }
    
    renderItem = ({item, index}) => {
        return(
            <View style={styles.row}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('FinalScorecard', {
                            course: item.course,
                            courseid: item.courseid,
                            trainingid: item.trainingid,
                            creationTime: item.creationTime,
                            tracks: item.tracks,
                        })
                        console.log('nupp')
                    }}
                    style={{width: '100%'}}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
                        <MaterialCommunityIcon
                            name='map-marker'
                            style={{marginRight: 15, color: 'black'}}
                            size={15}
                        />
                        <View style={{flex: 1, flexWrap: 'wrap'}}>
                            <Text style={{textAlignVertical: 'center', fontWeight: 'bold', fontSize: 15}}>{item.course} 
                            </Text>
                        </View>
                        
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
                        <MaterialCommunityIcon
                            name='calendar'
                            style={{marginRight: 15, color: 'black'}}
                            size={15}
                        />
                        <Text style={{textAlignVertical: 'center'}}>{item.formatedCreationTime} </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
                        <MaterialCommunityIcon
                            name='account-multiple'
                            style={{marginRight: 15, color: 'black'}}
                            size={15}
                        />
                        <Text style={{textAlignVertical: 'center'}}>Mängijaid: {item.playerIDs.length}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style = {{flex: 1, justifyContent: 'center'}}>
                    <TouchableOpacity 
                        style = {styles.button} 
                        onPress={() => this.props.navigation.navigate('TrainingCreation')}>
                        <Text>Alusta treeningut</Text>
                    </TouchableOpacity>
                </View>
                <View style = {{flex: 2, width: '95%'}}>
                    <Text>Minu treeningud:</Text>

                    <FlatList
                        data={this.state.trainings}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.FlatList}
                    />
                </View>
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
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#4293f5',
        borderRadius: 8
    },
    FlatList: {
        borderWidth: 2,
        borderColor: 'gray',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        margin: 2,
    },
  })