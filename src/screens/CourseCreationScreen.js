import React, { Component } from 'react';
import { Text, View, StyleSheet, Modal, ScrollView, TouchableOpacity, Picker } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Input, Button } from 'react-native-elements';
import { Snackbar } from 'react-native-paper';
import SearchableDropdown from 'react-native-searchable-dropdown';

import countriesJson from './../assets/countries.json';

export default class CourseCreationSreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            course: null,
            numberOfBaskets: null,
            location: null,
            county: null,
            country: null,
            pickerItems: [],
            visible: false,
            snackText: '',
            snackDuration: 3000,
            modalVisible: false,
        };
    }

    async componentDidMount() {
        this.setState({course: this.props.navigation.state.params.course})

        for (let i=0; i < 36; i++) {
            let obj = {
                label: String(i+1), 
                value: i+1,
                par: null
            }
            await this.setState({
                pickerItems: [...this.state.pickerItems, obj]
            });
        }
    }

    toggleModalVisibility(bool) {
        this.setState({modalVisible: bool});
    }

    checkInputs = () => {
        if(this.state.course === null || this.state.course === '') {
            this.setState({snackText: 'Palun sisesta raja nimi!'})
            this.setState({ visible: true })
            return
        }
        if(this.state.numberOfBaskets === null) {
            this.setState({snackText: 'Palun vali korvide arv!'})
            this.setState({ visible: true })
            return
        }
        if(this.state.country === null) {
            this.setState({snackText: 'Palun vali riik!'})
            this.setState({ visible: true })
            return
        }
        if(this.state.location === null || this.state.location === '') {
            this.setState({snackText: 'Palun sisesta asukoht!'})
            this.setState({ visible: true })
            return
        }
        if(this.state.county === null || this.state.county === '') {
            this.setState({snackText: 'Palun sisesta maakond!'})
            this.setState({ visible: true })
            return
        }

        this.props.navigation.navigate('CourseCreationBasket', {
            course: this.state.course,
            numberOfBaskets: this.state.numberOfBaskets,
            location: this.state.location,
            county: this.state.county,
            country: this.state.country,
            pickerItems: this.state.pickerItems,
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal visible={this.state.modalVisible}>
                    <View style={{backgroundColor: '#9ed6ff', flex: 1}}>
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
                    </View>
                </Modal>

                <ScrollView style={{width: '100%'}} contentContainerStyle={{width: '85%', alignSelf: 'center', marginTop: 15}}>

                    <Input
                        label='Raja nimi:'
                        placeholder='Nimi'
                        autoCapitalize="sentences"
                        leftIcon={() => {
                                return <MaterialIcon name='flag' size={20} color="gray" />;
                            }}
                        onChangeText={course => this.setState({ course })}
                        value={this.state.course}
                        inputContainerStyle={styles.inputContainerStyle}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
                    />

                    <View style={{flexDirection: 'row', width: '97%', paddingBottom: 5, paddingTop: 20, alignSelf: 'flex-end'}}>
                        <Text style={{textAlignVertical: 'center', textAlign: 'left', fontWeight: 'bold', color: '#ffff', fontSize: 16, flex: 0.5}}>Radu: </Text>
                    
                        <Picker
                            selectedValue={this.state.numberOfBaskets}
                            style={{height: '100%', alignSelf: 'center', flex: 1}}
                            onValueChange={(numberOfBaskets) => this.setState({ numberOfBaskets })}
                        >
                            <Picker.Item label="Radade arv" value={null} />
                            {this.state.pickerItems.map((item, index) => {
                                return (<Picker.Item label={item.label} value={item.value} key={index}/>) 
                            })}
                        </Picker>
                    </View>

                    <Input
                        label='Asukoht:'
                        placeholder='Asukoht'
                        autoCapitalize="sentences"
                        leftIcon={() => {
                                return <MaterialIcon name='location-on' size={20} color="gray" />;
                            }}
                        onChangeText={location => this.setState({ location })}
                        value={this.state.location}
                        containerStyle={{marginTop: 20}}
                        inputContainerStyle={styles.inputContainerStyle}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
                    />

                    <Input
                        label='Maakond:'
                        placeholder='Maakond'
                        autoCapitalize="sentences"
                        leftIcon={() => {
                                return <MaterialIcon name='landscape' size={20} color="gray" />;
                            }}
                        onChangeText={county => this.setState({ county })}
                        value={this.state.county}
                        containerStyle={{marginTop: 20}}
                        inputContainerStyle={styles.inputContainerStyle}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
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
                            containerStyle={{marginTop: 20}}
                            inputContainerStyle={styles.inputContainerStyle}
                            labelStyle={styles.inputLabelStyle}
                            inputStyle={styles.inputStyle}
                        />
                    </TouchableOpacity>

                    <Button
                        icon={
                            <MaterialIcon
                            name="add-circle"
                            size={15}
                            color="#4aaff7"
                            style = {{paddingRight: 10}}
                            />
                        }
                        buttonStyle={styles.button}
                        containerStyle={{width: '100%', alignItems: 'center', marginTop: 50}}
                        title="Lisa"
                        titleStyle={{color: '#4aaff7'}}
                        onPress = { () => { this.checkInputs() }}
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
		backgroundColor: '#9ed6ff'
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
})
