import React from 'react'
import { StyleSheet, Image, Text, View } from 'react-native'
import ImagePicker from 'react-native-image-picker';
import { Avatar, Input } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

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
			rating: null,
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
				rating: data.rating,
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
        return (
            <View style={styles.container}>

				{/* <View style={{backgroundColor: '#001b87', width: '100%'}}>
					<Text style={{fontSize: 30, alignSelf: 'center', color: 'white'}}>Profiil</Text>
				</View> */}

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

				<View style={{flex: 0.7, width: '100%', alignItems: 'center', backgroundColor: '#e0e0e0'}}>

					<Text style={styles.name}>{this.state.name}</Text>

					<Text style={styles.name}>Reiting: {this.state.rating}</Text>

					<View style={styles.tableContainer}>
						<View style={styles.tableRow}>
							<View style={styles.tableRowElement}>
								<Text>Riik: {this.state.country}</Text>
							</View>
							<View style={styles.tableRowElement}>
								<Text>PDGA#: {this.state.pdgaNumber}</Text>
							</View>
						</View>
						<View style={styles.tableRow}>
							<View style={styles.tableRowElement}>
								<Text>Sugu: {this.state.gender}</Text>
							</View>
							<View style={styles.tableRowElement}>
								<Text>Sünniaasta: {this.state.birthYear}</Text>
							</View>
						</View>
						<View style={styles.tableRow}>
							<Input
								placeholder="Email"
								disabled={true}
								leftIcon={() => {
									return <MaterialIcon name='email' size={20} color="gray" />;
								}}
								value={this.state.email}
								inputContainerStyle={{width: '50%', alignSelf: 'center'}}
							/>
						</View>
					</View>

					{/* <Text style={{ alignItems: 'center' }}>
						{this.state.name}{"\n"}
						Rating: {this.state.rating}{"\n"}
						PDGA#: {this.state.rating}{"\n"}
						Sugu: {this.state.gender}{"\n"}
						Riik: {this.state.country}{"\n"}
					</Text> */}

				</View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
		alignItems: 'center',
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
		backgroundColor: '#5fedd5',
		alignItems: 'center',
		justifyContent: 'center'
	},
	name: {
		fontSize: 30,
		fontWeight: 'bold',
		marginTop: 20
	},
	tableContainer: {
		width: '90%', 
		borderWidth: 1, 
		borderColor: 'black', 
		flexDirection: 'column',
		flex: 1
	},
	tableRow: {
		width: '100%', 
		flexDirection: 'row', 
		alignItems: 'center',
		flex: 1
	},
	tableRowElement: {
		flex: 1, 
		alignItems: 'center'
	},
})