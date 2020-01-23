import React, { Component } from 'react';
import { Text, View, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
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
                <Modal
                    visible={this.state.modalVisible}
                >
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
                />
                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                    <Text style={{fontSize: 20, textAlignVertical: "center"}}>Korve: </Text>
                    <RNPickerSelect
                        onValueChange={(numberOfBaskets) => this.setState({ numberOfBaskets })}
                        placeholder={{label: 'Korvide arv', value: null}}
                        items={this.state.pickerItems}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                top: 15,
                                right: 10,
                            },
                            placeholder: {
                                color: 'black',
                                fontSize: 12,
                                fontWeight: 'bold',
                            },
                        }}
                        useNativeAndroidPickerStyle = {false}
                        Icon={() => {
                            return <MaterialIcon name='expand-more' size={15} color="gray" />;
                        }}
                    />
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
                    inputContainerStyle={styles.inputContainerStyle}
                    containerStyle={{marginTop: 20}}
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
                    inputContainerStyle={styles.inputContainerStyle}
                    containerStyle={{marginTop: 20}}
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
                    containerStyle={{width: '100%', alignItems: 'center', marginTop: 50}}
                    title="Lisa"
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
    },
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#4293f5',
        borderRadius: 8,
        width: '40%'
    },
    inputContainerStyle: {
        borderWidth: 2, 
        borderColor: 'gray', 
        borderRadius: 10,
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'black',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
});