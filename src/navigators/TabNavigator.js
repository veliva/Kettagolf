import React from 'react'
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createAppContainer } from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ProfileMainScreen from '../screens/profile/ProfileMain'
import PlayersMainScreen from '../screens/players/PlayersMain'
import MoreMainScreen from '../screens/more/MoreMain'
import TrainingsMainScreen from '../screens/trainings/TrainingsMain'
import CoursesMainScreen from '../screens/courses/CoursesMain'

const TabNavigator = createBottomTabNavigator(
	{
		Trainings: { 
			screen: TrainingsMainScreen,
			navigationOptions: ({ navigation }) => ({
				tabBarIcon: ({ focused }) => <MaterialIcons name="fitness-center" size={20} color={focused ? '#000000' : '#878787'}/>,
				title: 'Treeningud',
			})
		},
		Players: { 
			screen: PlayersMainScreen,
			navigationOptions: ({ navigation }) => ({
				tabBarIcon: ({ focused }) => <MaterialIcons name="group" size={20} color={focused ? '#000000' : '#878787'}/>,
				title: 'Mängijad',
			})
		},
		Courses: {
			screen: CoursesMainScreen,
			navigationOptions: ({ navigation }) => ({
				tabBarIcon: ({ focused }) => (
					focused
						? <Image source={require('../assets/discbasket.png')} style={{width: 25, height: 25, tintColor: '#000000'}}  />
						: <Image source={require('../assets/discbasket.png')} style={{width: 25, height: 25, tintColor: '#878787'}}  /> 
				),
				title: 'Pargid',
			})
		},
		Profile: {
			screen: ProfileMainScreen,
			navigationOptions: ({ navigation }) => ({
				tabBarIcon: ({ focused }) => <MaterialIcons name="person" size={20} color={focused ? '#000000' : '#878787'}/>,
				title: 'Profiil',
			})
		},
		More: {
			screen: MoreMainScreen,
			navigationOptions: ({ navigation }) => ({
				tabBarIcon: ({ focused }) => <MaterialIcons name="menu" size={20} color={focused ? '#000000' : '#878787'}/>,
				title: 'Valikud',
			})
		}
	},
	{
		initialRouteName: 'Trainings',
		tabBarOptions: {
			initialRouteName: 'Trainings',
			activeTintColor: '#000000',
			activeBackgroundColor: '#ebebeb',
			inactiveTintColor: '#878787',
			showIcon: true,
		},
	}
);

const App = createAppContainer(TabNavigator);

export default App