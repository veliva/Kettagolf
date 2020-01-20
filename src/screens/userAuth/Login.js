import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import { firebase } from '@react-native-firebase/auth';

export default class Login extends React.Component {
    state = { 
        email: '', 
        password: '', 
        errorMessage: null 
    }  
  
    handleLogin = () => {
        // TODO: Firebase stuff...
        console.log('handleLogin')

        const { email, password } = this.state
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => this.props.navigation.navigate('TabNavigator'))
            .catch(error => this.setState({ errorMessage: error.message }))
    }  
  
    render() {
        return (
            <View style={styles.container}>
                <Text>Logi sisse</Text>

                {this.state.errorMessage &&
                <Text style={{ color: 'red' }}>
                    {this.state.errorMessage}
                </Text>}

                <TextInput
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />

                <TextInput
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Parool"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <TouchableOpacity onPress={this.handleLogin} style = {styles.button} >
                    <Text>Logi sisse</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')} style = {styles.button} >
                    <Text>Pole kasutajat? Registreeru!</Text>
                </TouchableOpacity>
            </View>
        )
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