import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import LandingScreen from './LandingScreen'
import TrainingCreationScreen from './TrainingCreationScreen'
import CourseCreationScreen from './../CourseCreationScreen'
import CourseCreationBasketScreen from './../CourseCreationBasketScreen'

const TrainingsStack = createStackNavigator(
	{
		Landing: {
			screen: LandingScreen,
			navigationOptions: {
				title: 'Treeningud'
			}
		},
		TrainingCreation: {
			screen: TrainingCreationScreen,
			navigationOptions: {
				title: 'Treeningu andmed'
			}
		},
		CourseCreation: {
			screen: CourseCreationScreen,
			navigationOptions: {
				title: 'Lisa rada'
			}
		},
		CourseCreationBasket: {
			screen: CourseCreationBasketScreen,
			navigationOptions: {
				title: 'Korvide andmed'
			}
		},
	},
	{
		initialRouteName: 'Landing',
	}
);

const TrainingsMain = createAppContainer(TrainingsStack);

export default TrainingsMain