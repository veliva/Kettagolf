import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

export default class CoursesMain extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            iconColor: '#878787',
            courseLocationsJSON: null
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
        try {
            let response = await fetch(
            'https://discgolfmetrix.com/api.php?content=courses_list&country_code=EE&name=a%',
            );
            let responseJson = await response.json();
            this.setState({courseLocationsJSON: responseJson})
            // console.log(this.state.courseLocationsJSON)
            this.sortJsonData()
        } catch (error) {
            console.error(error);
        }
    }

    sortJsonData = () => {
        const unsortedJson = this.state.courseLocationsJSON
        const unsortedJsonCourses = unsortedJson.courses
        let sortedJson = {}
        console.log(Object.keys(unsortedJsonCourses).length)

        for (var key of unsortedJsonCourses) {
            // console.log(key)
            if(key.X !== "" && key.Y !== "") {
                let obj = {
                    name: key.Fullname,
                    area: key.Area,
                    city: key.City,
                    latitude: key.X,
                    longitude: key.Y,
                }
                // sortedJson.assign(obj)
            }
        }
    }

    render() {
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
                    <Marker
                        coordinate={{latitude: 58.388540, longitude: 24.499905}}
                        title={'title'}
                        description={'description'}
                        image={require('../../assets/discbasket.png')}
                    />
                </MapView>
            </View>
        );
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