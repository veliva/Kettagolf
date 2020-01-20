import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default class LandingScreen extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <TouchableOpacity 
                        style = {styles.button}
                        onPress={() => this.props.navigation.navigate('CompetitionCreation')}
                    >
                        <Text>Loo võistlus</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text>Siin saab võistluse luua või ühienda mõne olemasolevaga.</Text>
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
    }
  })