import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class MoreMain extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>Info ja muu</Text>
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
    }
  })