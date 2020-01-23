import React from 'react'
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createAppContainer } from 'react-navigation'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ProfileMainScreen from '../screens/profile/ProfileMain'
import CompetitionsMainScreen from '../screens/competitions/CompetitionsMain'
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
		Competitions: { 
			screen: CompetitionsMainScreen,
			navigationOptions: ({ navigation }) => ({
				tabBarIcon: ({ focused }) => <MaterialIcons name="event" size={20} color={focused ? '#000000' : '#878787'}/>,
				title: 'Võistlused',
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
				title: 'Rajad',
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
				tabBarIcon: ({ focused }) => <MaterialIcons name="more-horiz" size={20} color={focused ? '#000000' : '#878787'}/>,
				title: 'Muu',
			})
		}
	},
	{
		initialRouteName: 'Profile',
		tabBarOptions: {
			initialRouteName: 'Profile',
			activeTintColor: '#000000',
			activeBackgroundColor: '#ebebeb',
			inactiveTintColor: '#878787',
			showIcon: true,
		},
	}
);

const App = createAppContainer(TabNavigator);

export default App