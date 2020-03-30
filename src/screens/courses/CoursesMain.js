import React, { Component } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

export default class CoursesMain extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            iconColor: '#878787',
            APICourseLocationsJSON: null,
            sortedCourseLocations: [],
            APIdataReady: false
        };
	}

    componentDidMount() {
        this.setState({iconColor: '#000000'})

        this.getCourseLocationsFromAPI()
    }

    componentWillUnmount() {
        this.setState({iconColor: '#878787'})
    }

    async getCourseLocationsFromAPI() {
        console.log('API NETIST')
        try {
            let response = await fetch(
            'https://discgolfmetrix.com/api.php?content=courses_list&country_code=EE',
            );
            let responseJson = await response.json();
            this.setState({APICourseLocationsJSON: responseJson})
            // console.log(this.state.courseLocationsJSON)
            this.sortJsonData()
        } catch (error) {
            console.error(error);
        }
    }

    sortJsonData = () => {
        const unsortedJson = this.state.APICourseLocationsJSON
        const unsortedJsonCourses = unsortedJson.courses
        console.log(Object.keys(unsortedJsonCourses).length)

        for (let key of unsortedJsonCourses) {
            if(key.X !== "" && key.Y !== "" && key.Enddate === null) {
                key.X = parseFloat(key.X)
                key.Y = parseFloat(key.Y)
                key.Fullname = key.Fullname.replace(' &rarr;', ':')
                const description = key.City === '' || key.Area === '' ? 'Asukoht: ' + key.City + key.Area : 'Asukoht: ' + key.City + ', ' + key.Area;
                let obj = {
                    id: key.ID,
                    name: key.Fullname,
                    area: key.Area,
                    city: key.City,
                    coordinates: {
                        latitude: key.X,
                        longitude: key.Y,
                    },
                    description: description
                }
                this.setState({
                    sortedCourseLocations: [...this.state.sortedCourseLocations, obj]
                })
            }
        }
        console.log(this.state.sortedCourseLocations.length)
        this.setState({APIdataReady: true})
    }

    render() {
        if (!this.state.APIdataReady) {
            return (
                <View style={styles.container}>
                    <Text>Erinevad rajad kaardi peal</Text>
                    <MapView style={styles.map}
                        initialRegion={{
                        latitude: 58.388540,
                        longitude: 24.499905,
                        latitudeDelta: 4,
                        longitudeDelta: 1,
                        }}
                        
                    >
                    </MapView>
                    <ActivityIndicator size="large" />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <Text>Erinevad pargid kaardi peal</Text>
                    <MapView style={styles.map}
                        initialRegion={{
                        latitude: 58.388540,
                        longitude: 24.499905,
                        latitudeDelta: 4,
                        longitudeDelta: 1,
                        }}
                    >
                        {this.state.sortedCourseLocations.map((marker, index) => (
                            <Marker
                                key = {index}
                                tracksViewChanges={false}
                                coordinate={marker.coordinates}
                                title={marker.name}
                                description={marker.description}
                                image={require('../../assets/discbasket.png')}
                            />
                        ))}
                    </MapView>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#4293f5',
        borderRadius: 8
    },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  })