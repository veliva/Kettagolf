import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class AboutScreen extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <View style = {{flex: 1, width: '90%', marginTop: 30, alignItems: 'center',}}>
                    <Text style={{fontSize: 17, fontWeight: 'bold', textAlign: 'center'}}>Antud rakendus on tehtud Tallinna Ülikooli üliõpilase Veli Vaiguri poolt bakalaureusetööna.</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#9ed6ff'
    },
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#4293f5',
        borderRadius: 8
    }
  })