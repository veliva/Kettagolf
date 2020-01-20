import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';

export default class CompetitionCreationSreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
			name: null,
			date: null,
			time: null,
			course: null,
            description: null,
            access: 'public',
        };
    }

    render() {

        const radio_props = [
            {label: 'Avalik', value: 'public' },
            {label: 'Privaatne', value: 'private' }
          ];
           
        return (
            <View style={styles.container}>
                <Text>Võistluse tegemine toimub siin!</Text>
                <TextInput
                    placeholder="Võistluse nimi"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={name => this.setState({ name })}
                    value={this.state.name}
                />
                <TextInput
                    placeholder="Kuupäev"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={date => this.setState({ date })}
                    value={this.state.date}
                />
                <TextInput
                    placeholder="Kellaaeg"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={time => this.setState({ time })}
                    value={this.state.time}
                />
                <TextInput
                    placeholder="Rada"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={course => this.setState({ course })}
                    value={this.state.course}
                />
                <TextInput
                    placeholder="Kirjeldus"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={description => this.setState({ description })}
                    value={this.state.description}
                />
                <RadioForm
                    radio_props={radio_props}
                    initial={0}
                    buttonColor={'#2196f3'}
                    onPress={(value) => {this.setState({access: value})}}
                />
                <TouchableOpacity 
                    style = {styles.button}
                    onPress={() => {console.log(this.state.access)}}
                >
                    <Text>Loo võistlus</Text>
                </TouchableOpacity>
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
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    },
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#4293f5',
        borderRadius: 8
    }
  })