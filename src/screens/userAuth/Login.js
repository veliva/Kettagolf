import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { firebase } from '@react-native-firebase/auth';
import { Snackbar } from 'react-native-paper';
import { Input, Button } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default class Login extends React.Component {
    state = { 
        email: '', 
        password: '',
        visible: false,
        snackText: '',
        snackDuration: 3000,
    }  
  
    handleLogin = () => {
        console.log('handleLogin')
        const { email, password } = this.state

        if(email === '') {
            this.setState({snackText: 'Palun sisesta email!'})
            this.setState({ visible: true })
            return
        }
        if(password === '') {
            this.setState({snackText: 'Palun sisesta parool!'})
            this.setState({ visible: true })
            return
        }
        
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => this.props.navigation.navigate('TabNavigator'))
            .catch(error => Alert.alert(
                'Error',
                error.message,
            ))
    }  
  
    render() {
        return (
            <View style={styles.container}>

                <View style={{flex: 0.4, justifyContent: 'flex-end'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 25, color: '#ffff', marginBottom: 30}}>Logi sisse</Text>
                </View>

                <View style={[styles.container, {width: '85%'}]}>
                    <Input
                        label="Email:"
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
                        labelStyle={{color: '#ffff', marginBottom: 7}}
                        inputStyle={{color: '#ffff'}}
                    />

                    <Input
                        secureTextEntry
                        label="Parool:"
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
                        labelStyle={{color: '#ffff', marginBottom: 7}}
                        inputStyle={{color: '#ffff'}}
                    />

                    <Button
                        buttonStyle={styles.button}
                        containerStyle={{width: '100%', alignItems: 'center', marginTop: 10}}
                        title="Logi sisse"
                        onPress={this.handleLogin}
                        titleStyle={{color: '#4aaff7'}}
                    />

                    <View style={{flexDirection: 'row', marginTop: 30}}>
                        <Text style={{fontSize: 15, textAlignVertical: 'center', color: '#ffff'}}>Pole kasutajat? </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                            <Text style={{fontWeight: 'bold', fontSize: 20, textAlignVertical: 'center', color: '#ffff'}}>Registreeru!</Text>
                        </TouchableOpacity>
                    </View>
                </View>

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
        alignItems: 'center',
        backgroundColor: '#168bde'
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: '#ffff',
        borderWidth: 1,
        marginTop: 8
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#4aaff7',
        borderRadius: 8,
    },
    button: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#ffff',
        borderRadius: 20,
        width: '95%'
    }
})