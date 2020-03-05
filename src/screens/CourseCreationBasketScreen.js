import React, { Component } from 'react';
import { Text, View, StyleSheet, FlatList, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Input, Button } from 'react-native-elements'
import { Snackbar } from 'react-native-paper';
import Ionicon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

export default class CourseCreationBasketSreen extends React.Component {

    constructor(props) {
        super(props);
        this.focusNextField = this.focusNextField.bind(this);
        this.inputs = {};
        this.state = {
            course: null,
            numberOfBaskets: null,
            location: null,
            county: null,
            country: null,
            pickerItems: [],
            visible: false,
            snackText: '',
            snackDuration: 3000
        };
    }

    async componentDidMount() {
        let courseBaskets = this.props.navigation.state.params.pickerItems
        courseBaskets = courseBaskets.slice(0, this.props.navigation.state.params.numberOfBaskets)
        await this.setState({
            course: this.props.navigation.state.params.course,
            numberOfBaskets: this.props.navigation.state.params.numberOfBaskets,
            location: this.props.navigation.state.params.location,
            county: this.props.navigation.state.params.county,
            country: this.props.navigation.state.params.country,
            pickerItems: courseBaskets,
        })

        console.log(this.state.location)
        console.log(this.state.county)
        console.log(this.state.country)
    }

    focusNextField(id) {
        const test = parseInt(id.replace('input_', ''))
        if(test > this.state.numberOfBaskets-1) {
            Keyboard.dismiss()
            return
        }
        this.inputs[id].focus();
    }

    checkInputs = () => {
        for(let i=0; i < this.state.numberOfBaskets-1; i++) {
            if(this.state.pickerItems[i].par === null || this.state.pickerItems[i].par === '') {
                const text = 'Raja ' + String(i+1) + ' par sisestamata!'
                this.setState({
                    visible: true,
                    snackText: text,
                })
                return
            }
        }
        
        let pickerItemsWithoutValue = JSON.parse(JSON.stringify(this.state.pickerItems))
        for(let i=0; i < this.state.numberOfBaskets; i++) {
            delete pickerItemsWithoutValue[i].value
        }
        this.addCourseToFirestore(pickerItemsWithoutValue)
    }

    addCourseToFirestore = (pickerItemsWithoutValue) => {
        firestore().collection('courses').add({
            name: this.state.course,
            numberOfBaskets: this.state.numberOfBaskets,
            location: this.state.location,
            county: this.state.county,
            country: this.state.country,
            tracks: pickerItemsWithoutValue,
        })
        .then(() => {
            console.log("Document successfully written!")
            this.props.navigation.popToTop() 
            && this.props.navigation.navigate('PlayerAdd', {
                course: this.state.course
            });
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }

    renderHeader = () => {
        return <View style = {styles.header}>
            <Text
                style={[styles.item, styles.headerText, {borderRightWidth: 2, borderRightColor: 'gray'}]}>
                Raja number
            </Text>
            <Text
                style={[styles.item, styles.headerText, {width:'60%'}]}>
                Par
            </Text>
        </View>;
    };

    FlatListItemSeparator = () => {
        return (
            <View style={{height: 2, width: '100%', backgroundColor: 'gray'}}/>
        );
    };

    GetItem = (item) => {
        Alert.alert(item);
    }

    render() {
           
        return (
            <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
                <View style={styles.container}>

                    <View style={styles.courseNameHeader}>
                        <Text style={styles.courseNameHeaderText}>{this.state.course}</Text>
                        <Text style={styles.location}>{this.state.location}, {this.state.county}</Text>
                        <Text style={styles.location}>{this.state.country}</Text>
                    </View>

                    <FlatList
                    persistentScrollbar={true}
                    style = {styles.FlatList}
                    data={this.state.pickerItems}
                    ListHeaderComponent={this.renderHeader}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    stickyHeaderIndices={[0]}
                    renderItem={({ item, index }) => (
                        <View style = {styles.row}>
                            <Text
                                style={[styles.item, {borderRightWidth: 2, borderRightColor: 'gray', fontWeight: 'bold'}]}
                                onPress={this.GetItem.bind(this, 'Label : '+item.label+' Value : '+item.value)}>
                                {item.value}
                            </Text>
                            <Input
                                ref={ input => {
                                    this.inputs['input_' + index] = input;
                                }}
                                blurOnSubmit={false}
                                onSubmitEditing={() => {
                                    this.focusNextField('input_' + parseInt(index+1));
                                }}
                                placeholder='Par'
                                containerStyle={{flex: 1}}
                                inputContainerStyle={styles.inputContainerStyle}
                                inputStyle={styles.inputStyle}
                                labelStyle={styles.inputLabelStyle}
                                keyboardType='numeric'
                                returnKeyType = {"next"}
                                onChangeText={text => {
                                    let { pickerItems } = this.state;
                                    pickerItems[index].par = text;
                                    this.setState({
                                        pickerItems,
                                    });
                                    this.focusNextField('input_' + parseInt(index+1));
                                }}
                                value={this.state.pickerItems[index].par}
                            />
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    />

                    <Button
                        icon={
                            <Ionicon
                            name="ios-add-circle"
                            size={15}
                            color="#4aaff7"
                            style = {{paddingRight: 10}}
                            />
                        }
                        buttonStyle={styles.button}
                        containerStyle={{flex: 0.2, width: '100%', alignItems: 'center'}}
                        title="Lisa"
                        titleStyle={{color: '#4aaff7'}}
                        onPress = { () => { this.checkInputs() }}
                    />

                    <Snackbar
                    visible={this.state.visible}
                    onDismiss={() => this.setState({ visible: false })}
                    duration={this.state.snackDuration}
                    action={{
                        label: 'Close',
                        onPress: () => {
                            this.setState({ visible: false })
                        },
                    }}
                    >
                        {this.state.snackText}
                    </Snackbar>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
        width: '85%',
        marginTop: 25,
        marginBottom: 30,
        flex: 0.6,
        backgroundColor: '#b3dfff',
        borderRadius: 5
    },
    item: {
        fontSize: 18,
        width: '40%',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    inputStyle: {
        textAlign: 'center',
        backgroundColor: '#4aaff7',
        color: '#ffff'
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#4aaff7',
        borderRadius: 8,
        width: '60%',
        alignSelf: 'center',
    },
    inputLabelStyle: {
        color: '#ffff', 
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        borderRadius: 5,
    },
    header: {
        flexDirection: 'row', 
        backgroundColor: '#168bde',
        borderRadius: 5,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingBottom: 10,
        paddingTop: 10,
        color: '#ffff'
    },
    courseNameHeader: {
        flex: 0.2,
        width: '90%',
        justifyContent: 'flex-end',
    },
    courseNameHeaderText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 35
    },
    location: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15
    }
})