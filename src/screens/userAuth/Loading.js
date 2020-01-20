import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { firebase } from '@react-native-firebase/auth';

export default class Loading extends React.Component {

    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? 'TabNavigator' : 'Login')
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <View style={styles.container}>
            <Text>Laeb...</Text>
            <ActivityIndicator size="large" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})