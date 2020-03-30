import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Button } from 'react-native';

export default class TestScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
           
        return (
            <View style={styles.container}>
                <Text>Test</Text>
                <Button
                    title='test'
                    onPress={() => this.props.navigation.goBack(null)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9ed6ff',
    },
  })