import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Input } from 'react-native-elements';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class LandingScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            course: null,
            coursesArr: [],
            trainings: [],
            tracksArr: [],
            tracks: null
        }
    }

    componentDidMount() {
        console.log('didMount')

        this.navFocusListener = this.props.navigation.addListener(
            'didFocus',
            param => {
                console.log('didFocus Landing')
                this.getTrainingsFromFirestore();
            }
        );

        // this.getTrainingsFromFirestore()
    }

    componentWillUnmount() {
        this.navFocusListener.remove()
    }

    async getTrainingsFromFirestore() {
        await this.setState({ tracksArr: [] })
        const { currentUser } = firebase.auth()
        await firestore().collection('trainings').where("playerIDs", "array-contains", currentUser.uid).orderBy('creationTime', 'desc').get()
        .then(async(querySnapshot) => {
            console.log(`Received query snapshot of size ${querySnapshot.size}`);
            if(querySnapshot._docs.length > 0) {
                let arr = []
                let coursesArr = []
                for(var i=0; i<querySnapshot._docs.length; i++)  {
                    let element = querySnapshot._docs[i]._data
                    element.trainingid = querySnapshot._docs[i].id
                    await this.tracksFromFirestore(element.courseid)
                    element.tracks = this.state.tracks
                    element.formatedCreationTime = this.timeConverter(element.creationTime)
                    arr.push(element);
                    coursesArr.push(element.course)
                }
                this.setState({trainings: arr})
                this.suggestedCourses(coursesArr)
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

    getCourseDataFromFirestore = () => {
        if(this.state.course === null || this.state.course === '') {
            return
        }
		firestore().collection('courses').where("name", "==", this.state.course).get()
		.then(snapshot => {
            if(snapshot._docs.length === 0) {
                Alert.alert(
                    'Tundmatu nimega park',
                    'Sellise nimega parki pole andmebaasis. Kas soovid selle lisada?',
                    [
                        {text: 'Ei', onPress: () => console.log('Ei vajutatud')},
                        {
                            text: '',
                        },
                        {text: 'Jah', onPress: () => {
                                this.props.navigation.navigate('CourseCreation', {course: this.state.course})
                            }
                        },
                    ],
                    {cancelable: false},
                );
            } else {
                console.log(snapshot._docs[0].id)
                this.props.navigation.navigate('PlayerAdd', {course: this.state.course})
            }
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }
    
    suggestedCourses = (coursesArr) => {
        const filteredSet = new Set(coursesArr)
        const filteredArr = [...filteredSet]
        if(filteredArr.length > 5) {
            this.setState({coursesArr: filteredArr.slice(0,5)})
            return
        }
        this.setState({coursesArr: filteredArr})
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
                        <View style={{flexWrap: 'wrap'}}>
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

    renderItemSuggested = ({item, index}) => {
        return(
            <View style={styles.suggestedRow}>
                <TouchableOpacity 
                    onPress={() => 
                        this.props.navigation.navigate('PlayerAdd', {course: item})
                    }>
                    <Text style={styles.suggestedItemText}>{item}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior='height' enabled>
                <View style = {styles.createTrainingContainer}>
                    <Input
                        label='Pargi nimi:'
                        placeholder="Pargi nimi"
                        autoCapitalize="sentences"
                        leftIcon={
                            <MaterialCommunityIcon
                                name='flag'
                                size={24}
                                color='black'
                            />
                        }
                        inputContainerStyle={styles.inputContainerStyle}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
                        onChangeText={course => this.setState({ course })}
                        value={this.state.course}
                    />
                    <Button
                        title='Alusta treeningut'
                        titleStyle={{color: '#4aaff7'}}
                        containerStyle={{width: '60%' ,marginTop: 5, alignItems: 'center'}}
                        buttonStyle={styles.button}
                        onPress = {() => this.getCourseDataFromFirestore()}
                    />

                    <View style={{width: '95%', marginTop: 10}}>
                        <Text style={{textAlign: 'left', fontWeight: 'bold', fontSize: 15, color: '#ffff'}}>Alusta treeningut: </Text>

                        <FlatList
                            data={this.state.coursesArr}
                            renderItem={this.renderItemSuggested}
                            keyExtractor={(item, index) => index.toString()}
                            style={{marginBottom: 10}}
                        />
                    </View>
                </View>
                
                <View style = {styles.trainingsContainer}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 5, color: '#ffff'}}>Minu treeningud:</Text>

                    <FlatList
                        data={this.state.trainings}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.FlatList}
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
    },
    FlatList: {
        backgroundColor: '#b3dfff',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 5,
        margin: 2,
        backgroundColor: '#7dc6fa'
    },
    trainingsContainer: {
        flex: 1,
        width: '95%',
    },
    createTrainingContainer: {
        width: '95%', 
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 0,
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
    suggestedRow: {
        backgroundColor: '#d4d4d4',
        marginTop: 4,
        borderRadius: 5,
    },
    button: {
        marginTop: 5,
        padding: 10,
        backgroundColor: '#ffff',
        borderRadius: 20,
        width: '95%'
    },
    suggestedItemText: {
        fontSize: 20, 
        textAlignVertical: 'center', 
        marginLeft: 5
    },
  })