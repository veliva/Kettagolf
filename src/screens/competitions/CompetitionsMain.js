import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView  } from 'react-native';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import LandingScreen from './LandingScreen'
import CompetitionCreationScreen from './CompetitionCreationScreen'

const CompetitionsStack = createStackNavigator(
	{
		Landing: {
			screen: LandingScreen,
			navigationOptions : {
				title: 'Võistlused'
			}
		},
		CompetitionCreation: {
			screen: CompetitionCreationScreen,
			navigationOptions : {
				title: 'Võistluse andmed'
			}
		},
	},
	{
		initialRouteName: 'Landing',
	}
);

const CompetitionsMain = createAppContainer(CompetitionsStack);

export default CompetitionsMain