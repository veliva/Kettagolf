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
            passwordConfirm: '',
            userID: '',
            firstName: '', 
            lastName: '',
            fullName: '',
            gender: 'Mees',
            birthYear: '',
            country: 'Estonia',
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
        if(this.state.password !== this.state.passwordConfirm) {
            this.setState({snackText: 'Paroolid on erinevad!'})
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
                <View style={{backgroundColor: '#168bde', flex: 1}}>
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
                        buttonStyle={{backgroundColor: '#4aaff7'}}
                    />
                    <SearchableDropdown
                        items={countriesJson}
                        onTextChange
                        onItemSelect={(value) => {
                            this.setState({country: value.name})
                            this.toggleModalVisibility(false)
                        }}
                        placeholder={'Vali riik...'}
                        placeholderTextColor={'white'}
                        containerStyle={{width: '100%', alignItems: 'center'}}
                        itemsContainerStyle={{width: '90%'}}
                        textInputStyle={styles.dropdownTextInput}
                        itemStyle={styles.dropdownItem}
                        listProps={
                            {
                                persistentScrollbar: true,
                            }
                        }
                        itemTextStyle={{ color: '#222' }}
                    />
                </View>
            </Modal>
            
            <ScrollView style={{width: '100%'}} contentContainerStyle={{width: '85%', alignSelf: 'center'}}>
                <View style={{alignItems: 'center', marginTop: 10}}>
                    <Text style={{fontWeight: 'bold', fontSize: 25, color: '#ffff', marginBottom: 10}}>Registreeru kasutajaks</Text>
                </View>

                <View style={{alignItems: 'center', width: '100%'}}>

                    <Input
                        label="Email:*"
                        placeholder="Email"
                        placeholderTextColor="#ffff"
                        keyboardType='email-address'
                        autoCapitalize="none"
                        leftIcon={() => {
                            return <MaterialIcon name='email' size={20} color="#ffff" />;
                        }}
                        style={styles.textInput}
                        onChangeText={email => this.setState({ email })}
                        value={this.state.email}
                        inputContainerStyle={styles.inputContainerStyle}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
                    />

                    <Input
                        secureTextEntry
                        label="Parool:*"
                        placeholder="Parool"
                        placeholderTextColor="#ffff"
                        autoCapitalize="none"
                        leftIcon={() => {
                            return <MaterialIcon name='vpn-key' size={20} color="#ffff" />;
                        }}
                        onChangeText={password => this.setState({ password })}
                        value={this.state.password}
                        inputContainerStyle={styles.inputContainerStyle}
                        containerStyle={{marginTop: 10}}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
                    />

                    <Input
                        secureTextEntry
                        label="Parooli kordus:*"
                        placeholder="Parooli kordus"
                        placeholderTextColor="#ffff"
                        autoCapitalize="none"
                        leftIcon={() => {
                            return <MaterialIcon name='vpn-key' size={20} color="#ffff" />;
                        }}
                        onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
                        value={this.state.passwordConfirm}
                        inputContainerStyle={styles.inputContainerStyle}
                        containerStyle={{marginTop: 10}}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
                    />

                    <Input
                        label='Eesnimi:*'
                        placeholder="Eesnimi"
                        placeholderTextColor="#ffff"
                        autoCapitalize="words"
                        leftIcon={() => {
                            return <MaterialIcon name='account-circle' size={20} color="#ffff" />;
                        }}
                        onChangeText={firstName => { this.setState({ firstName }), this.updateFullName(firstName, this.state.lastName)}}
                        value={this.state.firstName}
                        inputContainerStyle={styles.inputContainerStyle}
                        containerStyle={{marginTop: 10}}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
                    />

                    <Input
                        label='Perekonnanimi:*'
                        placeholder="Perekonnanimi"
                        placeholderTextColor="#ffff"
                        autoCapitalize="words"
                        leftIcon={() => {
                            return <MaterialIcon name='account-circle' size={20} color="#ffff" />;
                        }}
                        onChangeText={lastName => { this.setState({ lastName }), this.updateFullName(this.state.firstName ,lastName)}}
                        value={this.state.lastName}
                        inputContainerStyle={styles.inputContainerStyle}
                        containerStyle={{marginTop: 10}}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
                    />
                    
                    <View style={{flexDirection: 'row', width: '95%', paddingBottom: 5, paddingTop: 10}}>
                        <Text style={{textAlignVertical: 'center', textAlign: 'left', fontWeight: 'bold', color: '#ffff', fontSize: 16, flex: 0.5}}>Sugu:* </Text>
                    
                        <Picker
                            selectedValue={this.state.gender}
                            style={{height: '100%', alignSelf: 'center', flex: 1}}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({gender: itemValue}, console.log(this.state.gender))
                            }>
                            <Picker.Item label="Mees" value="Mees" />
                            <Picker.Item label="Naine" value="Naine" />
                        </Picker>
                    </View>

                    <Input
                        label='Sünniaasta:*'
                        placeholder="Sünniaasta"
                        placeholderTextColor="#ffff"
                        autoCapitalize="none"
                        onChangeText={birthYear => this.setState({ birthYear })}
                        value={this.state.birthYear}
                        keyboardType='numeric'
                        inputContainerStyle={styles.inputContainerStyle}
                        containerStyle={{marginTop: 10}}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
                    />

                    <TouchableOpacity style={{width: '100%'}} onPress = { () => { this.toggleModalVisibility(true) }}>
                        <Input
                            label='Riik:*'
                            placeholder='Riik'
                            placeholderTextColor="#ffff"
                            autoCapitalize="sentences"
                            disabled={true}
                            leftIcon={() => {
                                    return <MaterialIcon name='language' size={20} color="#ffff" />;
                                }}
                            value={this.state.country}
                            inputContainerStyle={styles.inputContainerStyle}
                            containerStyle={{marginTop: 10}}
                            labelStyle={styles.inputLabelStyle}
                            inputStyle={styles.inputStyle}
                        />
                    </TouchableOpacity>

                    <Input
                        label='PDGA number:'
                        placeholder="PDGA number"
                        placeholderTextColor="#ffff"
                        style={styles.textInput}
                        onChangeText={pdgaNumber => this.setState({ pdgaNumber })}
                        value={this.state.pdgaNumber}
                        keyboardType='numeric'
                        containerStyle={{marginTop: 10}}
                        inputContainerStyle={styles.inputContainerStyle}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
                    />

                    <Button
                        buttonStyle={styles.button}
                        containerStyle={{width: '100%', alignItems: 'center', marginTop: 10}}
                        title="Registreeru"
                        titleStyle={{color: '#4aaff7'}}
                        onPress = { () => { this.checkInputs() }}
                    />

                    <View style={{flexDirection: 'row', marginTop: 30}}>
                        <Text style={{fontSize: 15, textAlignVertical: 'center', color: '#ffff'}}>Kasutaja olemas? </Text>
                        <TouchableOpacity onPress = { () => { this.props.navigation.navigate('Login') }}>
                            <Text style={{fontWeight: 'bold', fontSize: 20, textAlignVertical: 'center', color: '#ffff'}}>Logi sisse!</Text>
                        </TouchableOpacity>
                    </View>

                </View>
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
        backgroundColor: '#168bde',
        alignItems: 'center',
        width: '100%'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8
    },
    button: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#ffff',
        borderRadius: 20,
        width: '95%'
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#4aaff7',
        borderRadius: 8,
    },
    inputLabelStyle: {
        color: '#ffff', 
        marginBottom: 5,
    },
    inputStyle: {
        color: '#ffff'
    },
    dropdownTextInput: {
        textAlign: 'left', 
        width: '90%',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        padding: 10,
        color: 'white',
    },
    dropdownItem: {
        padding: 10,
        marginTop: 2,
        backgroundColor: '#ddd',
        borderColor: '#bbb',
        borderWidth: 1,
        borderRadius: 5,
    }
})