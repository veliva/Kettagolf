import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class AboutScreen extends React.Component {

    returnMaterialCommunityIcon = (name) => {
        return(
            <MaterialCommunityIcon
            name={name}
            size={15}
            color="black"
            style = {{paddingRight: 10}}
            />
        )
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>

                <View style = {{width: '90%', marginTop: 30,}}>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>Antud rakendus on tehtud Tallinna Ülikooli üliõpilase Veli Vaiguri poolt bakalaureusetööna.</Text>
                </View>

                <View style = {{width: '90%', marginTop: 30, flexDirection: 'row', flexWrap: 'wrap'}}>
                    <Text>Korvi ikoon on kaitstud {this.returnMaterialCommunityIcon("creative-commons")} Creative Commons litsentsiga. Ikooni autor on Steve Cardwell. </Text>
                    <TouchableOpacity onPress={ ()=>{ Linking.openURL('https://thenounproject.com/term/disc-golf-basket/1299/')}}>
                        <Text style={{fontWeight: 'bold'}}>Link korvile</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#9ed6ff'
    },
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#4293f5',
        borderRadius: 8
    }
  })