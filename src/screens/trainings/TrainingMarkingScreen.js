import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// results: [
//     {
//         uid: 123,
//         playerResults: [
//             {
//                 result: 3,
//                 diff: -1,
//                 OB: 0
//             }
//         ]
//     }
// ]

export default class TrainingMarkingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.inputs = {};
        this.state = {
            course: null,
            players: [],
            tracks: [{label: '', par: ''}],
            focusedInput: 0,
            focusedTrack: 0,
            results: null,
            focused: true,
        };

        this.selected = {
            backgroundColor: '#b4f9fe',
        }

        this.unselected = {
            backgroundColor: '#e9f0f8',
        }
    }

    async componentDidMount() {
        console.log('---------------------------------')
        await this.setState({
            course: this.props.navigation.state.params.course,
            players: this.props.navigation.state.params.players,
        })
        
        await this.getCourseDataFromFirestore()
        await console.log(this.state.tracks)

        this.initResults()
        // console.log(this.state.results[0])
        this.inputs['input_0'].setNativeProps({style: this.selected});
    }

    async getCourseDataFromFirestore() {
		await firestore().collection('courses').where("name", "==", this.state.course).get()
		.then(snapshot => {
            // console.log(snapshot._docs[0].id)
            // console.log(snapshot._docs[0])
            // console.log(snapshot._docs[0]._data.tracks)
            this.setState({tracks: snapshot._docs[0]._data.tracks})
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
    }
    
    initResults = () => {
        let trackObj = []
        for(let i=0; i<this.state.tracks.length; i++) {
            const trackResult = {
                result: '',
                diff: '',
                OB: '0'
            }
            trackObj.push(trackResult)
        }

        let resultsArr = []
        for(let i=0; i<this.state.players.length; i++) {
            let obj = {
                uid: this.state.players[i].uid,
                playerResults: JSON.parse(JSON.stringify(trackObj)),
                sum: 0,
                diff: 0
            }
            resultsArr.push(obj)
        }
        
        this.setState({
            results: resultsArr
        })
    }

    changeInputValue = (value) => {
        if(!this.state.focused){
            return
        }
        let focusedInput = this.state.focusedInput
        if(focusedInput+1 < this.state.players.length) {
            focusedInput = focusedInput + 1
        } else {
            this.setState({focused: false})
        }

        this.changeSelectedColor(this.state.focusedInput+1)

        let updatedArray = [...this.state.results];
        updatedArray[this.state.focusedInput].playerResults[this.state.focusedTrack].result = value

        let diff = value - parseInt(this.state.tracks[this.state.focusedTrack].par)
        updatedArray[this.state.focusedInput].playerResults[this.state.focusedTrack].diff = String(diff)

        this.setState({
            results: updatedArray,
            focusedInput: focusedInput
        })
    }

    changeFocusedTrack = (value) => {
        if(value === 'back') {
            if(this.state.focusedTrack-1 < 0) {
                return
            }
            this.setState({
                focusedTrack: this.state.focusedTrack-1,
                focusedInput: 0,
                focused: true
            })
        } else if(value === 'next') {
            if(this.state.focusedTrack+1 > this.state.tracks.length-1) {
                return
            }
            this.setState({
                focusedTrack: this.state.focusedTrack+1,
                focusedInput: 0,
                focused: true
            })
        }
        this.changeSelectedColor(0)
    }

    changeOBvalue = () => {
        if(!this.state.focused) {
            return
        }
        let updatedArray = [...this.state.results];
        const OBvalue = updatedArray[this.state.focusedInput].playerResults[this.state.focusedTrack].OB
        if(OBvalue === '0') {
            updatedArray[this.state.focusedInput].playerResults[this.state.focusedTrack].OB = '1'
        } else if(OBvalue === '1') {
            updatedArray[this.state.focusedInput].playerResults[this.state.focusedTrack].OB = '0'
        }
        this.setState({
            results: updatedArray
        })
    }

    changeSelectedColor = (newIndex) => {
        const newSelection = 'input_' + newIndex
        const oldSelection = 'input_' + this.state.focusedInput
        this.inputs[oldSelection].setNativeProps({style: this.unselected});
        if(newIndex < this.state.players.length) {
            this.inputs[newSelection].setNativeProps({style: this.selected});
        }
    }

    calculateScore = () => {
        console.log('CALCULATE SCORE')
        let arr = []

        for(let i=0; i < this.state.players.length; i++) {
            const playerResults = this.state.results[i].playerResults
            let sum = 0
            let diff = 0
            for (let key in playerResults) {
                if (playerResults.hasOwnProperty(key)) {
                    sum += parseInt(playerResults[key].result) || 0
                    diff += parseInt(playerResults[key].diff) || 0
                }
            }
            arr.push({sum: sum, diff: diff})
        }

        console.log(arr)
        let updatedArray = [...this.state.results];
        for(let key in updatedArray) {
            if (updatedArray.hasOwnProperty(key)) {
                updatedArray[key].diff = arr[key].diff
                updatedArray[key].sum = arr[key].sum
            }
        }
        this.setState({results: updatedArray})
    }

    renderItem = ({item, index}) => {
        // console.log(JSON.stringify(item))
        if(this.state.results !== null) {
            const OBvalue = this.state.results[index].playerResults[this.state.focusedTrack].OB
            let test = ''
            if(OBvalue === '1') {
                test = {color: 'red'}
            } else if(OBvalue === '0') {
                test = {color: 'black'}
            }
            return (
                <View style = {styles.row}>
                    <Text style={{flex: 1, textAlign: 'left', textAlignVertical: 'center', marginLeft: 3}}>{item.fullName}</Text>
                    <Text style={[test, {flex: 0.3, textAlign: 'center', textAlignVertical: 'center'}]}>OB</Text>
                    <TouchableOpacity
                        style={{flex: 0.3, width: '100%'}} 
                        onPress={() => { 
                            this.setState({ 
                                focusedInput: index,
                                focused: true
                            }), 
                            this.changeSelectedColor(index) 
                        }}
                    >
                        <TextInput
                            style={{color: 'black', backgroundColor: '#e9f0f8', textAlign: 'center', flex: 1}}
                            showSoftInputOnFocus={false}
                            caretHidden={false}
                            pointerEvents="none"
                            editable={false}
                            ref={ input => {
                                this.inputs['input_' + index] = input;
                            }}
                            value={this.state.results[index].playerResults[this.state.focusedTrack].result}
                        />
                    </TouchableOpacity>
                    <Text style={{flex: 0.3, textAlignVertical: 'center', textAlign: 'center'}}>{this.state.results[index].sum}</Text>
                    <Text style={{flex: 0.3, textAlignVertical: 'center', textAlign: 'center'}}>{this.state.results[index].diff}</Text>
                </View>
            )
        }
    }

    render() {
        return(
            <View style={styles.container}>

                <View style={styles.headerContainer}>
                    <Text>{this.state.course}</Text>
                    <Text>Korv {this.state.tracks[this.state.focusedTrack].label}</Text>
                    <Text>Par {this.state.tracks[this.state.focusedTrack].par}</Text>
                </View>

                <FlatList
                    style = {styles.FlatList}
                    data={this.state.players}
                    // ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />

                <View style={styles.keyboardContainer}>
                    <View style={styles.keyboard}>
                        <View style={styles.keyboardColumn}>
                        <View style={styles.numberContainer}>
                                <Button
                                    title='0'
                                    containerStyle={{flex: 0.5, width: '85%', alignSelf: 'center', justifyContent: 'center'}}
                                    buttonStyle={styles.numberButtonStyle}
                                />
                                <Button
                                    icon={
                                        <MaterialIcon
                                        name="arrow-back"
                                        size={15}
                                        color="white"
                                        />
                                    }
                                    containerStyle={{justifyContent: 'center', flex: 1, width: '85%', alignSelf: 'center', justifyContent: 'center'}}
                                    buttonStyle={{flex: 0.95}}
                                    onPress={() => { this.changeFocusedTrack('back') }}
                                />
                            </View>
                        </View>
                        <View style={styles.keyboardColumn}>
                            <View style={styles.numberContainer}>
                                <Button
                                    title='1'
                                    containerStyle={styles.numberContainerStyle}
                                    buttonStyle={styles.numberButtonStyle}
                                    onPress={() => this.changeInputValue('1')}
                                />
                                <Button
                                    title='4'
                                    containerStyle={styles.numberContainerStyle}
                                    buttonStyle={styles.numberButtonStyle}
                                    onPress={() => this.changeInputValue('4')}
                                />
                                <Button
                                    title='7'
                                    containerStyle={styles.numberContainerStyle}
                                    buttonStyle={styles.numberButtonStyle}
                                    onPress={() => this.changeInputValue('7')}
                                />
                            </View>
                        </View>
                        <View style={styles.keyboardColumn}>
                            <View style={styles.numberContainer}>
                                <Button
                                    title='2'
                                    containerStyle={styles.numberContainerStyle}
                                    buttonStyle={styles.numberButtonStyle}
                                    onPress={() => this.changeInputValue('2')}
                                />
                                <Button
                                    title='5'
                                    containerStyle={styles.numberContainerStyle}
                                    buttonStyle={styles.numberButtonStyle}
                                    onPress={() => this.changeInputValue('5')}
                                />
                                <Button
                                    title='8'
                                    containerStyle={styles.numberContainerStyle}
                                    buttonStyle={styles.numberButtonStyle}
                                    onPress={() => this.changeInputValue('8')}
                                />
                            </View>
                        </View>
                        <View style={styles.keyboardColumn}>
                            <View style={styles.numberContainer}>
                                <Button
                                    title='3'
                                    containerStyle={styles.numberContainerStyle}
                                    buttonStyle={styles.numberButtonStyle}
                                    onPress={() => this.changeInputValue('3')}
                                />
                                <Button
                                    title='6'
                                    containerStyle={styles.numberContainerStyle}
                                    buttonStyle={styles.numberButtonStyle}
                                    onPress={() => this.changeInputValue('6')}
                                />
                                <Button
                                    title='9'
                                    containerStyle={styles.numberContainerStyle}
                                    buttonStyle={styles.numberButtonStyle}
                                    onPress={() => this.changeInputValue('9')}
                                />
                            </View>
                        </View>
                        <View style={styles.keyboardColumn}>
                            <View style={styles.numberContainer}>
                                <Button
                                    title='OB'
                                    containerStyle={{flex: 0.5, width: '85%', alignSelf: 'center', justifyContent: 'center'}}
                                    buttonStyle={styles.numberButtonStyle}
                                    onPress={() => this.changeOBvalue()}
                                />
                                <Button
                                    icon={
                                        <MaterialIcon
                                        name="arrow-forward"
                                        size={15}
                                        color="white"
                                        />
                                    }
                                    containerStyle={{justifyContent: 'center', flex: 1, width: '85%', alignSelf: 'center', justifyContent: 'center'}}
                                    buttonStyle={{flex: 0.95}}
                                    onPress={() => { this.changeFocusedTrack('next'), this.calculateScore() }}
                                />
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    FlatList: {
        width: '95%',
        marginTop: 25,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        flex: 0.5,
        alignSelf: 'center',
    },
    row: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    keyboardContainer: {
        flex: 0.4,
        width: '100%',
        backgroundColor: '#ababab',
        marginBottom: 20
    },
    keyboard: {
        width: '95%',
        // backgroundColor: 'red',
        flex: 1,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    keyboardColumn: {
        flex: 1,
        justifyContent: 'center',
    },
    numberContainerStyle: {
        flex: 1, 
        justifyContent: 'center', 
        alignSelf: 'center', 
        width: '90%'
    },
    numberButtonStyle: {
        flex: 0.90, 
        justifyContent: 'center',
    },
    numberContainer: {
        flex: 0.95, 
        justifyContent: 'center'
    },
    headerContainer: {
        flex: 0.2,
        alignItems: 'center'
    },
    test2: {
        backgroundColor: 'purple'
    }
})