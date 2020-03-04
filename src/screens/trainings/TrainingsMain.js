import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import LandingScreen from './LandingScreen'
import CourseCreationScreen from './../CourseCreationScreen'
import CourseCreationBasketScreen from './../CourseCreationBasketScreen'
import PlayerAddScreen from './PlayerAddScreen'
import TrainingMarkingScreen from './TrainingMarkingScreen'
import FinalScorecardScreen from './FinalScorecardScreen'

const TrainingsStack = createStackNavigator(
	{
		Landing: {
			screen: LandingScreen,
			navigationOptions: {
				title: 'Treeningud'
			}
		},
		CourseCreation: {
			screen: CourseCreationScreen,
			navigationOptions: {
				title: 'Lisa park'
			}
		},
		CourseCreationBasket: {
			screen: CourseCreationBasketScreen,
			navigationOptions: {
				title: 'Radade andmed'
			}
		},
		PlayerAdd: {
			screen: PlayerAddScreen,
			navigationOptions: {
				title: 'Treeningus osalejad'
			}
		},
		TrainingMarking: {
			screen: TrainingMarkingScreen,
			navigationOptions: {
				title: 'Märkimine'
			}
		},
		FinalScorecard: {
			screen: FinalScorecardScreen,
			navigationOptions: {
				title: 'Tulemused'
			}
		},
	},
	{
		initialRouteName: 'Landing',
	}
);

const TrainingsMain = createAppContainer(TrainingsStack);

export default TrainingsMain