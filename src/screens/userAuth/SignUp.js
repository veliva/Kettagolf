import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Picker, ScrollView, Modal } from 'react-native'
import { Input, Button } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Snackbar } from 'react-native-paper';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import countriesJson from './../../assets/countries.json';

export default class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '', 
            password: '',
            userID: '',
            firstName: '', 
            lastName: '',
            fullName: '',
            gender: 'male',
            birthYear: '',
            country: '',
            pdgaNumber: null,
            errorMessage: null,
            modalVisible: false,
            visible: false,
            snackText: '',
            snackDuration: 3000,
        };
    }

    checkInputs = () => {
        if(this.state.email === null || this.state.email === '') {
            this.setState({snackText: 'Palun sisesta email!'})
            this.setState({ visible: true })
            return
        }
        if(this.state.password === null || this.state.password === '') {
            this.setState({snackText: 'Palun sisesta parool!'})
            this.setState({ visible: true })
            return
        }
        if(this.state.firstName === null || this.state.firstName === '') {
            this.setState({snackText: 'Palun sisesta eesnimi!'})
            this.setState({ visible: true })
            return
        }
        if(this.state.lastName === null || this.state.lastName === '') {
            this.setState({snackText: 'Palun sisesta perekonnanimi!'})
            this.setState({ visible: true })
            return
        }
        if(this.state.birthYear === null || this.state.birthYear === '') {
            this.setState({snackText: 'Palun sisesta sünniaasta!'})
            this.setState({ visible: true })
            return
        }
        if(this.state.country === null) {
            this.setState({snackText: 'Palun vali riik!'})
            this.setState({ visible: true })
            return
        }

        this.handleSignUp()
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
                    fullName: this.state.fullName,
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

    updateFullName = (first, last) => {
        const test = first + ' ' + last
        this.setState({fullName: test})
    }

    toggleModalVisibility(bool) {
        this.setState({modalVisible: bool});
    }

    render() {
        return (
        <View style={styles.container}>
            <Modal visible={this.state.modalVisible}>
                <Button
                    icon={
                        <MaterialIcon
                        name="close"
                        size={15}
                        color="white"
                        style = {{paddingRight: 10}}
                        />
                    }
                    title="Tühista"
                    onPress = { () => { this.toggleModalVisibility(false) }}
                />
                <SearchableDropdown
                    items={countriesJson}
                    onTextChange
                    onItemSelect={(value) => {
                        this.setState({country: value.name})
                        this.toggleModalVisibility(false)
                    }}
                    placeholder={'Vali riik...'}
                    containerStyle={{width: '100%', alignItems: 'center'}}
                    itemsContainerStyle={{width: '90%'}}
                    textInputStyle={{
                        textAlign: 'left', 
                        width: '90%',
                        borderWidth: 1,
                        borderColor: 'black',
                        borderRadius: 5,
                        padding: 10
                    }}
                    itemStyle={{
                        padding: 10,
                        marginTop: 2,
                        backgroundColor: '#ddd',
                        borderColor: '#bbb',
                        borderWidth: 1,
                        borderRadius: 5,
                    }}
                    listProps={
                        {
                            persistentScrollbar: true,
                        }
                    }
                    itemTextStyle={{ color: '#222' }}
                />
            </Modal>

            <ScrollView style={styles.container}>
            <Text>Registreeru</Text>
            {this.state.errorMessage &&
            <Text style={{ color: 'red' }}>
                {this.state.errorMessage}
            </Text>}
            <Input
                label="Email:"
                placeholder="Email"
                autoCapitalize="none"
                leftIcon={() => {
                    return <MaterialIcon name='email' size={20} color="gray" />;
                }}
                style={styles.textInput}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
                inputContainerStyle={styles.inputContainerStyle}
            />
            <Input
                secureTextEntry
                label="Parool:"
                placeholder="Parool"
                autoCapitalize="none"
                leftIcon={() => {
                    return <MaterialIcon name='vpn-key' size={20} color="gray" />;
                }}
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={{marginTop: 10}}
            />
            <Input
                label='Eesnimi:'
                placeholder="Eesnimi"
                autoCapitalize="words"
                leftIcon={() => {
                    return <MaterialIcon name='account-circle' size={20} color="gray" />;
                }}
                onChangeText={firstName => { this.setState({ firstName }), this.updateFullName(firstName, this.state.lastName)}}
                value={this.state.firstName}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={{marginTop: 10}}
            />

            <Input
                label='Perekonnanimi:'
                placeholder="Perekonnanimi"
                autoCapitalize="words"
                leftIcon={() => {
                    return <MaterialIcon name='account-circle' size={20} color="gray" />;
                }}
                onChangeText={lastName => { this.setState({ lastName }), this.updateFullName(this.state.firstName ,lastName)}}
                value={this.state.lastName}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={{marginTop: 10}}
            />

            <Input
                label='Mängija nimi: (eesnimi + perekonnanimi)'
                placeholder='Mängija nimi'
                autoCapitalize="words"
                disabled={true}
                leftIcon={() => {
                        return <MaterialIcon name='face' size={20} color="gray" />;
                    }}
                value={this.state.fullName}
                inputContainerStyle={styles.inputContainerStyle}
                containerStyle={{marginTop: 10}}
            />

            <Picker
                selectedValue={this.state.gender}
                style={{height: 50, width: 120, alignSelf: 'center'}}
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

            <TouchableOpacity onPress = { () => { this.toggleModalVisibility(true) }}>
                <Input
                    label='Riik:'
                    placeholder='Riik'
                    autoCapitalize="sentences"
                    disabled={true}
                    leftIcon={() => {
                            return <MaterialIcon name='language' size={20} color="gray" />;
                        }}
                    value={this.state.country}
                    inputContainerStyle={styles.inputContainerStyle}
                    containerStyle={{marginTop: 20}}
                />
            </TouchableOpacity>

            <TextInput
                placeholder="PDGA number"
                style={styles.textInput}
                onChangeText={pdgaNumber => this.setState({ pdgaNumber })}
                value={this.state.pdgaNumber}
                keyboardType='numeric'
            />

            <Button
                icon={
                    <MaterialIcon
                    name="add-circle"
                    size={15}
                    color="white"
                    style = {{paddingRight: 10}}
                    />
                }
                buttonStyle={styles.button}
                containerStyle={{width: '100%', alignItems: 'center', marginTop: 20}}
                title="Registreeru!"
                onPress = { () => { this.checkInputs() }}
            />

            <Button
                buttonStyle={styles.button}
                containerStyle={{width: '100%', alignItems: 'center', marginTop: 20}}
                title="Logi sisse"
                onPress = { () => { this.props.navigation.navigate('Login') }}
            />
            </ScrollView>
            <Snackbar
                visible={this.state.visible}
                onDismiss={() => this.setState({ visible: false })}
                duration={this.state.snackDuration}
                action={{
                    label: 'Close',
                    onPress: () => {
                        this.setState({ visible: false })
                    },
                }}
                >
                {this.state.snackText}
            </Snackbar>
        </View>
        )  
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        borderRadius: 8,
        width: '40%',
    },
    inputContainerStyle: {
        borderWidth: 2, 
        borderColor: 'gray', 
        borderRadius: 10,
    },
})