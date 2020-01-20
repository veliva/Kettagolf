import React from 'react'
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native'
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';

export default class Main extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			fireStorageImageURI: null,
			currentUser: null,
			name: null,
			gender: null,
			rating: null,
			country: null,
			pdgaNumber: null
        };
	}

    componentDidMount() {
        const { currentUser } = firebase.auth()
		this.setState({ currentUser })

		this.userDataFromFirestore(currentUser.uid)

		this.imageFromFirebaseStorage(currentUser.uid)
		
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? 'TabNavigator' : 'Login')
        })
	}

	componentWillUnmount() {
        this.unsubscribe();
	}
	
	userDataFromFirestore = (userID) => {
		firestore().collection('users').doc(userID).get()
		.then(snapshot => {
			console.log(snapshot._data)
			const data = snapshot._data
			const nameFromDB = data.firstName + ' ' + data.lastName
			this.setState({
				name: nameFromDB,
				gender: data.gender,
				country: data.country,
				rating: data.rating,
				pdgaNumber: data.pdgaNumber
			})
		})
		.catch(err => {
			console.log('Error getting documents', err);
		});
	}
	
	async imageFromFirebaseStorage(userID) {
		const imageRef = firebase.storage().ref('profilePictures').child(userID);
		await imageRef.getDownloadURL().then(result => {
			this.setState({fireStorageImageURI: result})
			console.log(result)
		});
	}

	async uploadImageToFirebaseStorage(response, userID) {
		const { uri } = response;
		const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
		await firebase.storage()
			.ref('profilePictures/' + userID)
			.putFile(uploadUri)
			.then(file => file.ref)
			.catch(error => error);
		this.imageFromFirebaseStorage(this.state.currentUser.uid)
	}

	handleSignOut = () => {
        console.log('handle sign out')
        firebase
            .auth()
            .signOut()
    }

	chooseFile = () => {
        let options = {
			title: 'Select Image',
			storageOptions: {
				skipBackup: true,
				path: 'Kettagolf',
			},
        };
        ImagePicker.showImagePicker(options, response => {
			// console.log('Response = ', response);
     
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else {
				this.uploadImageToFirebaseStorage(response, this.state.currentUser.uid)
			}
        });
	};
  
    render() {
        const { currentUser } = this.state
        
        return (
            <View style={styles.container}>
				<Image
					source={{ uri: this.state.fireStorageImageURI }}
					style={{ width: 250, height: 250, backgroundColor: 'gray' }}
				/>
				<Text style={{ alignItems: 'center' }}>
					{/* {this.state.fireStorageImageURI} */}
					{this.state.name}{"\n"}
					Rating: {this.state.rating}{"\n"}
					PDGA#: {this.state.rating}{"\n"}
					Sugu: {this.state.gender}{"\n"}
					Riik: {this.state.country}{"\n"}
				</Text>
				<TouchableOpacity onPress={this.chooseFile.bind(this)} style = {styles.button}>
                    <Text>Lisa pilt</Text>
                </TouchableOpacity>
                {/* <Text>
                    Hi {currentUser && currentUser.email}!
                </Text> */}
                <TouchableOpacity onPress={this.handleSignOut} style = {styles.button}>
                    <Text>Logi välja</Text>
                </TouchableOpacity>
            </View>
        )
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
    }
})