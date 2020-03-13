import React from 'react'
import { StyleSheet, Image, Text, View } from 'react-native'
import ImagePicker from 'react-native-image-picker';
import { Avatar, Input } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export default class Main extends React.Component {
	
	constructor(props) {
        super(props);
        this.state = {
			fireStorageImageURI: null,
			currentUser: null,
			name: null,
			gender: null,
			country: null,
			pdgaNumber: null,
			birthYear: null,
			email: null
        };
	}

    componentDidMount() {
        const { currentUser } = firebase.auth()
		this.setState({ currentUser })

		this.userDataFromFirestore(currentUser.uid)

		this.imageFromFirebaseStorage(currentUser.uid)
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
				pdgaNumber: data.pdgaNumber,
				birthYear: data.birthYear,
				email: data.email
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
		})
		.catch(err => {
			console.log('Error getting documents', err);
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
			title: 'Vali profiilipilt',
			takePhotoButtonTitle: 'Tee pilt kaameraga...',
			chooseFromLibraryButtonTitle: 'Vali pilt galeriist...',
			cancelButtonTitle: 'Tühista',
			quality: 0.3,
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
        return (
            <View style={styles.container}>

				<View style={styles.avatarView}>
					<Avatar
						source={{ uri: this.state.fireStorageImageURI }}
						style={{ flex: 0.9,
							aspectRatio: 1, 
							resizeMode: 'contain', borderRadius: 50,
							overflow: "hidden", }}
						editButton={{ size:50 }}
						onPress={this.chooseFile.bind(this)}
						onEditPress={this.chooseFile.bind(this)}
						showEditButton
					/>
				</View>

				<View style={{flex: 0.2, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
					<Text style={styles.name}>{this.state.name}</Text>
					<Text style={styles.country}>{this.state.country}</Text>
				</View>

				<View style={{flex: 0.5, width: '85%', alignItems: 'center'}}>

					<Input
						label='Email'
						disabled={true}
						value={this.state.email}
						leftIcon={() => {
                            return <MaterialCommunityIcon name='email' size={20} color="black" />;
						}}
						leftIconContainerStyle={{marginLeft: 0}}
						containerStyle={styles.inputContainerStyle}
						labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
						disabledInputStyle={styles.disabledInputStyle}
					/>
					<Input
						label='Sugu'
						disabled={true}
						value={this.state.gender}
						leftIcon={() => {
                            return <MaterialCommunityIcon name='gender-male-female' size={20} color="black" />;
						}}
						leftIconContainerStyle={{marginLeft: 0}}
						containerStyle={styles.inputContainerStyle}
						labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
						disabledInputStyle={styles.disabledInputStyle}
					/>
					<Input
						label='Sünniaasta'
						disabled={true}
						value={this.state.birthYear}
						leftIcon={() => {
                            return <MaterialCommunityIcon name='calendar-month' size={20} color="black" />;
						}}
						leftIconContainerStyle={{marginLeft: 0}}
						containerStyle={styles.inputContainerStyle}
						labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
						disabledInputStyle={styles.disabledInputStyle}
					/>
					<Input
						label='PDGA#'
						disabled={true}
						value={this.state.pdgaNumber}
						leftIcon={() => {
                            return <MaterialCommunityIcon name='disc' size={20} color="black" />;
						}}
						leftIconContainerStyle={{marginLeft: 0}}
						containerStyle={styles.inputContainerStyle}
						labelStyle={styles.inputLabelStyle}
                        inputStyle={styles.inputStyle}
						disabledInputStyle={styles.disabledInputStyle}
					/>

				</View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
		alignItems: 'center',
		backgroundColor: '#9ed6ff'
    },
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#4293f5',
        borderRadius: 8
	},
	avatarView: {
		width: '100%',
		flex: 0.3,
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	name: {
		fontSize: 34,
		fontWeight: 'bold',
		marginTop: 20,
	},
	country: {
		fontSize: 15,
		fontWeight: 'bold',
		marginTop: 10
	},
	inputContainerStyle: {
		width: '85%', 
		flex: 1,
	},
	disabledInputStyle: {
		color: 'black', 
		opacity:1
	},
    inputLabelStyle: {
        color: 'black',
    },
    inputStyle: {
        color: 'black'
    },
})