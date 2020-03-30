import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Input, Button } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SearchableDropdown from 'react-native-searchable-dropdown';

import countriesJson from './../assets/countries.json';

export default class CountryPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            country: null
        };
    }

    componentDidMount() {
        this.setState({ country: this.props.country })
    }

    toggleModalVisibility(bool) {
        this.setState({modalVisible: bool});
    }
    
    render() {
        return(
            <View style={{width: '90%'}}>
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
                                this.props.callback(value);
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

            
                <TouchableOpacity onPress = { () => { this.toggleModalVisibility(true) }}>
                    <Input
                        label='Riik:'
                        placeholder='Riik'
                        autoCapitalize="sentences"
                        disabled={true}
                        leftIcon={() => {
                                return <MaterialIcon name='language' size={20} color="gray" />;
                            }}
                        value={this.props.country}
                        disabledInputStyle={{opacity: 1}}
                        containerStyle={{marginTop: 10}}
                        inputContainerStyle={styles.inputContainerStyle}
                        labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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

CountryPicker.propTypes = {
    country: PropTypes.string.isRequired,
}