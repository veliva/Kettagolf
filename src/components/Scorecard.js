import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default class Scorecard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results9: [],
            results18: [],
            results27: [],
            results36: [],
        }
    }

    async componentDidMount() {
        for(let key in this.props.results) {
            if (this.props.results.hasOwnProperty(key)) {
                const name = this.props.results[key].name
                const playerResults = this.props.results[key].playerResults
                await this.setState({
                    results9: [...this.state.results9, {name: name, playerResults: playerResults.slice(0,9)}],
                    results18: [...this.state.results18, {name: name, playerResults: playerResults.slice(9,18)}],
                    results27: [...this.state.results27, {name: name, playerResults: playerResults.slice(18,27)}],
                    results36: [...this.state.results36, {name: name, playerResults: playerResults.slice(27,36)}]
                })
            }
        }
    }

    getBackgroundColor = (item) => {
        if(item === undefined) {
            return {borderWidth: 2, borderColor: 'transparent'}
        }

        const diff = parseInt(item.diff)
        const result = parseInt(item.result)
        const OB = parseInt(item.OB)
        let color = '#ebebeb'
        if(result === 1) {
            color = '#faea5c'
        } else if(diff === -1) {
            color = '#96ff96'
        } else if(diff === -2) {
            color = '#02c90d'
        } else if(diff === -3) {
            color = '#1d19ff'
        } else if(diff === -4 || diff < -4) {
            color = '#ab3cf0'
        } else if(diff === 1) {
            color = '#ffb3b3'
        } else if(diff === 2) {
            color = '#ff8282'
        } else if(diff === 3 || diff > 3) {
            color = '#f54949'
        }

        if(OB === 1) {
            return {backgroundColor: color, borderWidth: 2, borderColor: '#ff0000'}
        }
        return {backgroundColor: color, borderWidth: 2, borderColor: 'transparent'}
    }

    renderItemScorecard = ({item, index}) => {
        const playerResults = item.playerResults
        return(
            <View style={{flex: 1, flexDirection: 'row', marginTop: 5}}>
                <View style={{flex: 5}}>
                    <Text style={{marginLeft: 4}}>{item.name}</Text>
                </View>
                <Text style={[styles.scorecardItemResult, this.getBackgroundColor(playerResults[0])]}>
                    {playerResults[0] !== undefined ? playerResults[0].result : '' }
                </Text>
                <Text style={[styles.scorecardItemResult, this.getBackgroundColor(playerResults[1])]}>
                    {playerResults[1] !== undefined ? playerResults[1].result : '' } 
                </Text>
                <Text style={[styles.scorecardItemResult, this.getBackgroundColor(playerResults[2])]}>
                    {playerResults[2] !== undefined ? playerResults[2].result : '' } 
                </Text>
                <Text style={[styles.scorecardItemResult, this.getBackgroundColor(playerResults[3])]}>
                    {playerResults[3] !== undefined ? playerResults[3].result : '' } 
                </Text>
                <Text style={[styles.scorecardItemResult, this.getBackgroundColor(playerResults[4])]}>
                    {playerResults[4] !== undefined ? playerResults[4].result : '' } 
                </Text>
                <Text style={[styles.scorecardItemResult, this.getBackgroundColor(playerResults[5])]}>
                    {playerResults[5] !== undefined ? playerResults[5].result : '' } 
                </Text>
                <Text style={[styles.scorecardItemResult, this.getBackgroundColor(playerResults[6])]}>
                    {playerResults[6] !== undefined ? playerResults[6].result : '' } 
                </Text>
                <Text style={[styles.scorecardItemResult, this.getBackgroundColor(playerResults[7])]}>
                    {playerResults[7] !== undefined ? playerResults[7].result : '' } 
                </Text>
                <Text style={[styles.scorecardItemResult, this.getBackgroundColor(playerResults[8])]}>
                    {playerResults[8] !== undefined ? playerResults[8].result : '' } 
                </Text>
            </View>
        )
    }

    renderHeader(item) {
        return (
            <View style={{flex: 1, flexDirection: 'row', backgroundColor: '#d9d9d9'}}>
                <View style={{flex: 5, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center'}}>
                    <Text style={{marginRight: 10, fontSize: 12}}>Korv</Text>
                    <Text style={{marginRight: 10, fontSize: 12}}>Par</Text>
                </View>
                <View style={styles.headerItemView}>
                    <Text style={styles.headerTrackNumber}>{item[0] !== undefined ? item[0].label : '' } </Text>
                    <Text style={styles.headerPar}>{item[0] !== undefined ? item[0].par : '' } </Text>
                </View>
                <View style={styles.headerItemView}>
                    <Text style={styles.headerTrackNumber}>{item[1] !== undefined ? item[1].label : '' } </Text>
                    <Text style={styles.headerPar}>{item[1] !== undefined ? item[1].par : '' } </Text>
                </View>
                <View style={styles.headerItemView}>
                    <Text style={styles.headerTrackNumber}>{item[2] !== undefined ? item[2].label : '' } </Text>
                    <Text style={styles.headerPar}>{item[2] !== undefined ? item[2].par : '' } </Text>
                </View>
                <View style={styles.headerItemView}>
                    <Text style={styles.headerTrackNumber}>{item[3] !== undefined ? item[3].label : '' } </Text>
                    <Text style={styles.headerPar}>{item[3] !== undefined ? item[3].par : '' } </Text>
                </View>
                <View style={styles.headerItemView}>
                    <Text style={styles.headerTrackNumber}>{item[4] !== undefined ? item[4].label : '' } </Text>
                    <Text style={styles.headerPar}>{item[4] !== undefined ? item[4].par : '' } </Text>
                </View>
                <View style={styles.headerItemView}>
                    <Text style={styles.headerTrackNumber}>{item[5] !== undefined ? item[5].label : '' } </Text>
                    <Text style={styles.headerPar}>{item[5] !== undefined ? item[5].par : '' } </Text>
                </View>
                <View style={styles.headerItemView}>
                    <Text style={styles.headerTrackNumber}>{item[6] !== undefined ? item[6].label : '' } </Text>
                    <Text style={styles.headerPar}>{item[6] !== undefined ? item[6].par : '' } </Text>
                </View>
                <View style={styles.headerItemView}>
                    <Text style={styles.headerTrackNumber}>{item[7] !== undefined ? item[7].label : '' } </Text>
                    <Text style={styles.headerPar}>{item[7] !== undefined ? item[7].par : '' } </Text>
                </View>
                <View style={styles.headerItemView}>
                    <Text style={styles.headerTrackNumber}>{item[8] !== undefined ? item[8].label : '' } </Text>
                    <Text style={styles.headerPar}>{item[8] !== undefined ? item[8].par : '' } </Text>
                </View>
            </View>
        )
    }

    render() {
        let courseLength = ''
        if(this.props.results != null) {
            courseLength = this.props.results[0].playerResults.length
        }
        return (
            <View>
                {courseLength > 0 &&
                    <FlatList
                        data={this.state.results9}
                        renderItem={this.renderItemScorecard}
                        ListHeaderComponent={this.renderHeader(this.props.tracks.slice(0,9))}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.FlatList}
                    />
                }
                {courseLength > 9 && 
                    <FlatList
                        data={this.state.results18}
                        renderItem={this.renderItemScorecard}
                        ListHeaderComponent={this.renderHeader(this.props.tracks.slice(9,18))}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.FlatList}
                    />
                }
                {courseLength > 18 && 
                    <FlatList
                        data={this.state.results27}
                        renderItem={this.renderItemScorecard}
                        ListHeaderComponent={this.renderHeader(this.props.tracks.slice(18,27))}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.FlatList}
                    />
                }
                {courseLength > 27 &&
                    <FlatList
                        data={this.state.results36}
                        renderItem={this.renderItemScorecard}
                        ListHeaderComponent={this.renderHeader(this.props.tracks.slice(27,36))}
                        keyExtractor={(item, index) => index.toString()}
                        style={styles.FlatList}
                    />
                }
            </View> 
        );
    }
}

const styles = StyleSheet.create({
    headerTrackNumber: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
    headerPar: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
    },
    scorecardItemResult: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 15,
    },
    FlatList: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        paddingBottom: 5,
        marginBottom: 20,
    },
    headerItemView: {
        flex: 1, 
        borderWidth: 2, 
        borderColor: 'transparent'
    },
})

Scorecard.propTypes = {
    results: PropTypes.array.isRequired,
    tracks: PropTypes.array.isRequired,
}