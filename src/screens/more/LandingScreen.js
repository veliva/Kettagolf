import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { Button } from 'react-native-elements'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import { firebase } from '@react-native-firebase/auth';

export default class MoreMain extends React.Component {

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? 'TabNavigator' : 'Login')
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleSignOut = () => {
        console.log('handle sign out')

        Alert.alert(
            'Logi välja',
            'Kas soovid välja logida?',
            [
              {text: 'Ei', onPress: () => console.log('Ei soovi välja logida')},
              {
                text: '',
              },
              {text: 'Jah', onPress: () => firebase.auth().signOut()},
            ],
            {cancelable: false},
        );
    }

    render() {
        return (
            <View style={styles.container}>
                
                <ScrollView style={{flex: 1, width: '100%'}}>
                    <View style={styles.tableContainer}>
                        <View style={styles.tableElement}>
                            <Text style={styles.tableElementHeader}>Seaded</Text>
                                <Button
                                    icon={
                                        <MaterialCommunityIcon
                                        name="logout"
                                        size={15}
                                        color="black"
                                        style = {{paddingRight: 10}}
                                        />
                                    }
                                    title='Logi välja'
                                    buttonStyle={styles.button}
                                    titleStyle={styles.buttonTitleStyle}
                                    onPress={this.handleSignOut}
                                />
                        </View>

                        <View style={styles.tableElement}>
                            <Text style={styles.tableElementHeader}>Info</Text>
                            <Button
                                icon={
                                    <MaterialCommunityIcon
                                    name="information-outline"
                                    size={15}
                                    color="black"
                                    style = {{paddingRight: 10}}
                                    />
                                }
                                title='Teave rakenduse kohta'
                                buttonStyle={styles.button}
                                titleStyle={styles.buttonTitleStyle}
                                onPress={() => this.props.navigation.navigate('About')}
                            />
                            <Button
                                icon={
                                    <FontAwesome5Icon
                                    name="github"
                                    size={15}
                                    color="black"
                                    style = {{paddingRight: 10}}
                                    />
                                }
                                title='Lähtekood GitHubis'
                                buttonStyle={styles.button}
                                titleStyle={styles.buttonTitleStyle}
                                onPress={ ()=>{ Linking.openURL('https://github.com/veliva/Kettagolf')}}
                            />
                        </View>

                    </View>
                </ScrollView>
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
    tableContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'column'
    },
    tableElement: {
        width: '100%',
        marginTop: 15,
        alignSelf: 'center',
    },
    tableElementHeader: {
        fontSize: 15,
        fontWeight: 'bold',
        width: '95%',
        alignSelf: 'center',
    },
    button: {
        marginTop: 2,
        padding: 8,
        backgroundColor: '#e0e0e0',
        width: '100%',
    },
    buttonTitleStyle: {
        width: '90%', 
        textAlign: 'left',
        color: 'black',
    }
  })