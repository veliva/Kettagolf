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
            pickerItems: [],
            visible: false,
            snackText: '',
            snackDuration: 3000
        };
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

        Alert.alert('kõik ilusti tehtud')
    }

    async componentDidMount() {
        let courseBaskets = this.props.navigation.state.params.pickerItems
        courseBaskets = courseBaskets.slice(0, this.props.navigation.state.params.numberOfBaskets)
        await this.setState({
            course: this.props.navigation.state.params.course,
            numberOfBaskets: this.props.navigation.state.params.numberOfBaskets,
            location: this.props.navigation.state.params.location,
            county: this.props.navigation.state.params.county,
            pickerItems: courseBaskets,
        })

        console.log(this.state.location)
        console.log(this.state.county)
    }

    renderHeader = () => {
        return <View style = {styles.header}>
            <Text
                style={[styles.item, styles.headerText, {borderRightWidth: 1, borderRightColor: 'black', borderTopRightRadius: 5}]}>
                Korvi number
            </Text>
            <Text
                style={[styles.item, styles.headerText, {width:'60%'}]}>
                Par
            </Text>
        </View>;
    };

    FlatListItemSeparator = () => {
        return (
            <View style={{height: 0.5, width: '100%', backgroundColor: '#C8C8C8'}}/>
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
                            style={[styles.item, {borderRightWidth: 1, borderRightColor: 'black'}]}
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
                            inputStyle={styles.textInput}
                            containerStyle={{flex: 1}}
                            inputContainerStyle={{width: '60%', alignSelf: 'center'}}
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
                        color="white"
                        style = {{paddingRight: 10}}
                        />
                    }
                    buttonStyle={styles.button}
                    containerStyle={{flex: 0.2, width: '90%', alignItems: 'center'}}
                    title="Lisa"
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
        alignItems: 'center'
    },
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#4293f5',
        borderRadius: 8,
        width: '50%',
    },
    FlatList: {
        width: '90%',
        marginTop: 25,
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        flex: 0.6
    },
    item: {
        fontSize: 18,
        width: '40%',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    textInput: {
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 5,
    },
    header: {
        flexDirection: 'row', 
        backgroundColor: '#c5d9e3',
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 5,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingBottom: 10,
        paddingTop: 10
    },
    courseNameHeader: {
        flex: 0.2,
        width: '90%',
        justifyContent: 'center',
    },
    courseNameHeaderText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 35
    }
})