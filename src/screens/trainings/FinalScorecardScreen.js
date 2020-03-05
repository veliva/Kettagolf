import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Button, Avatar } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import Scorecard from './../../components/Scorecard';

import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);

export default class TrainingMarkingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.inputs = {};
        this.state = {
            course: null,
            courseid: null,
            trainingid: null,
            creationTime: null,
            formatedCreationTime: null,
            results: null,
            resultsOrdered: null,
            images: [],
            databaseDone: false,
            tracks: null,
            finished: null,
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: () => (
                <MaterialCommunityIcon
                    name='delete-forever-outline'
                    style={{marginRight: 15, color: 'red'}}
                    size={25}
                    onPress={navigation.getParam('deleteTraining')}
                />
            ),
        };
    };

    async componentDidMount() {
        this.props.navigation.setParams({ deleteTraining: this.deleteTraining});

        await this.setState({
            course: this.props.navigation.state.params.course,
            courseid: this.props.navigation.state.params.courseid,
            trainingid: this.props.navigation.state.params.trainingid,
            creationTime: this.props.navigation.state.params.creationTime,
            formatedCreationTime: this.timeConverter(this.props.navigation.state.params.creationTime),
            tracks: this.props.navigation.state.params.tracks,
        })

        await this.getTrainingDataFromFirestore()

        await this.state.resultsOrdered.forEach(element => {
            this.imageFromFirebaseStorage(element.uid)
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

    async getTrainingDataFromFirestore() {
		await firestore().collection('trainings').doc(this.state.trainingid).get()
		.then(snapshot => {
            const ordered = snapshot._data.results.sort((a, b) => a.diff - b.diff);
            this.setState({
                results: snapshot._data.results,
                resultsOrdered: ordered,
                finished: snapshot._data.finished
            })
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }

    async imageFromFirebaseStorage(userID) {
        if(userID.substring(0, 5) === 'temp ') {
            const user = {uid: userID, uri: 'https://firebasestorage.googleapis.com/v0/b/kettagolf-d21a1.appspot.com/o/profilePictures%2FtempAvatar.png?alt=media&token=ff8626a0-9b86-4971-b5df-a831c2e91b88'}
            this.setState({
                images: [...this.state.images, user],
                databaseDone: true
            })
            return
        }
		const imageRef = firebase.storage().ref('profilePictures').child(userID);
		await imageRef.getDownloadURL().then(result => {
            const user = {uid: userID, uri: result}
            this.setState({
                images: [...this.state.images, user],
                databaseDone: true
            })
		})
		.catch(err => {
			console.log('Error getting documents', err);
        });
    }

    finishTraining = () => {
        Alert.alert(
            'Lõpeta treening',
            'Kas soovid tulemused kinnitada ja treeningu lõpetada?',
            [
                {text: 'Ei', },
                {
                    text: '',
                },
                {text: 'Jah', onPress: () => { 
                        const trainingref = firestore().collection('trainings').doc(this.state.trainingid)
                        trainingref.update({finished: true});
                        this.setState({ finished: true })
                        this.props.navigation.popToTop() &&
                        this.props.navigation.navigate('FinalScorecard', {
                            course: this.state.course,
                            courseid: this.state.courseid,
                            trainingid: this.state.trainingid,
                            creationTime: this.state.creationTime,
                            tracks: this.state.tracks,
                        })
                    }
                },
            ],
            {cancelable: false},
        );
    }

    deleteTraining = () => {
        Alert.alert(
            'Kustuta treening',
            'Kas oled kindel, et soovid treeningu kustutada?',
            [
                {text: 'Ei', },
                {
                    text: '',
                },
                {text: 'Jah', onPress: () => { 
                        const trainingref = firestore().collection('trainings').doc(this.state.trainingid)
                        trainingref.delete()
                        this.props.navigation.popToTop()
                    }
                },
            ],
            {cancelable: false},
        );
    }

    renderItemStandingsTable = ({item, index}) => {
        if(this.state.databaseDone && this.state.images.length === this.state.results.length) {
            const player = this.state.images.find(x => x.uid == item.uid)
            return(
                <View style={{flexDirection: 'row', flex: 1, marginBottom: 7, backgroundColor: '#d1d1d1'}}>
                    <View style={{flex: 7, flexDirection: 'row',}}>
                        <Avatar
                            rounded
                            source={{
                                uri: player.uri,
                            }}
                        />
                        <Text 
                            style={{
                                textAlignVertical: 'center',
                                marginLeft: 10
                            }}>
                            {this.state.resultsOrdered[index].name}
                        </Text>
                    </View>
                    
                    <Text style={styles.standingsRowSmallElement}>{this.state.resultsOrdered[index].diff}</Text>
                    <Text style={styles.standingsRowSmallElement}>{this.state.resultsOrdered[index].sum}</Text>
                </View>
            )
        } else {
            return
        }
    }

    renderHeader = () => {
        return(
            <View style={styles.standingsTableHeader}>
                <View style={{flex: 7}}>
                    <Text style={{textAlignVertical: 'center', fontWeight: 'bold'}}>Mängija</Text>
                </View>
                <Text style={[styles.standingsRowSmallElement, {fontWeight: 'bold'}]}>+/-</Text>
                <Text style={[styles.standingsRowSmallElement, {fontWeight: 'bold'}]}>Sum</Text>
            </View>
        )
    }

    render() {
        return(
            <ScrollView style={{backgroundColor: '#9ed6ff'}} contentContainerStyle={{alignItems: 'center', backgroundColor: '#9ed6ff',}}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.courseNameText}>{this.state.course}</Text>
                        <Text style={styles.creationTimeText}>Kuupäev ja kell: {this.state.formatedCreationTime}</Text>
                    </View>
                    
                    <View style={styles.standingsTable}>
                        <FlatList
                            data={this.state.resultsOrdered}
                            renderItem={this.renderItemStandingsTable}
                            ListHeaderComponent={this.renderHeader}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>

                    <View style={styles.tableContainer}>
                        {this.state.results !== null && this.state.tracks !== null && 
                            <Scorecard
                                tracks={this.state.tracks} 
                                results={this.state.results}
                            />
                        }
                    </View>

                    
                        {this.state.finished !== true && this.state.finished !== null &&
                            <View>
                                <Button
                                    title='Lõpeta treening'
                                    titleStyle={{color: '#4aaff7'}}
                                    buttonStyle={styles.button}
                                    containerStyle={{alignSelf: 'center', width: '100%', alignItems: 'center'}}
                                    onPress={() => this.finishTraining()}
                                />
                            </View>
                        }
                    
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '95%',
        backgroundColor: '#9ed6ff',
    },
    standingsTable: {
        marginBottom: 20,
    },
    tableContainer: {
        // flex: 0
    },
    headerContainer: {
        marginBottom: 30,
        marginTop: 20,
        justifyContent: 'center'
    },
    courseNameText: {
        textAlign: 'left',
        fontSize: 23,
        fontWeight: 'bold',
        textAlignVertical: 'center'
    },
    creationTimeText: {
        textAlign: 'left'
    },
    standingsRowSmallElement: {
        flex: 1, 
        textAlign: 'center', 
        textAlignVertical: 'center',
    },
    standingsTableHeader: {
        flexDirection: 'row', 
        flex: 1, 
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black'
    },
    button: {
        backgroundColor: '#ffff',
        borderRadius: 20,
        width: '90%'
    },
})