import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default class TrainingsMain extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <View style = {{flex: 1, justifyContent: 'center'}}>
                    <TouchableOpacity 
                        style = {styles.button} 
                        onPress={() => this.props.navigation.navigate('TrainingCreation')}>
                        <Text>Alusta treeningut</Text>
                    </TouchableOpacity>
                </View>
                <View style = {{flex: 1}}>
                    <Text>Rajad, kus viimati mängisid:</Text>
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