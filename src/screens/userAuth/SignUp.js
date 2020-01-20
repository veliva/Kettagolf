import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Picker } from 'react-native'
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class SignUp extends React.Component {
    state = { 
        email: '', 
        password: '',
        userID: '',
        firstName: '', 
        lastName: '', 
        gender: 'male',
        birthYear: '',
        country: '',
        pdgaNumber: null,
        errorMessage: null 
    }
  
    handleSignUp = () => {
        // TODO: Firebase stuff...
        console.log('handleSignUp')

        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((res) => {
                firestore().collection('users').doc(res.user.uid).set({
                    email: this.state.email,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    gender: this.state.gender,
                    birthYear: this.state.birthYear,
                    country: this.state.country,
                    rating: 0,
                    pdgaNumber: this.state.pdgaNumber
                });
                
                this.props.navigation.navigate('TabNavigator') 
            })
            .catch(error => this.setState({ errorMessage: error.message }))
    }

    render() {
        return (
        <View style={styles.container}>
            <Text>Registreeru</Text>
            {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
                {this.state.errorMessage}
            </Text>}
            <TextInput
                placeholder="Email"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
            />
            <TextInput
                secureTextEntry
                placeholder="Parool"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
            />
            <TextInput
                placeholder="Eesnimi"
                autoCapitalize="words"
                style={styles.textInput}
                onChangeText={firstName => this.setState({ firstName })}
                value={this.state.firstName}
            />
            <TextInput
                placeholder="Perekonnanimi"
                autoCapitalize="words"
                style={styles.textInput}
                onChangeText={lastName => this.setState({ lastName })}
                value={this.state.lastName}
            />
            <Picker
                selectedValue={this.state.gender}
                style={{height: 50, width: 120}}
                onValueChange={(itemValue, itemIndex) =>
                    this.setState({gender: itemValue}, console.log(this.state.gender))
                }>
                <Picker.Item label="Mees" value="male" />
                <Picker.Item label="Naine" value="female" />
            </Picker>
            <TextInput
                placeholder="Sünniaasta"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={birthYear => this.setState({ birthYear })}
                value={this.state.birthYear}
                keyboardType='numeric'
            />
            <TextInput
                placeholder="Riik"
                autoCapitalize="words"
                style={styles.textInput}
                onChangeText={country => this.setState({ country })}
                value={this.state.country}
            />
            <TextInput
                placeholder="PDGA number"
                style={styles.textInput}
                onChangeText={pdgaNumber => this.setState({ pdgaNumber })}
                value={this.state.pdgaNumber}
                keyboardType='numeric'
            />
            <TouchableOpacity
                onPress={this.handleSignUp}
                style = {styles.button}
                >
                <Text>Registreeru!</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Login')}
                style = {styles.button}
                >
                <Text>Kasutaja juba olemas? Logi sisse</Text>
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