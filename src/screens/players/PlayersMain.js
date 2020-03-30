import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView  } from 'react-native';
import { createAppContainer } from 'react-navigation'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import ViewStackNavigator from './view/ViewStackNavigator'
import AddStackNavigator from './add/AddStackNavigator'

const PlayersTopTabNavigator = createMaterialTopTabNavigator(
	{
		ViewStackNavigator: {
			screen: ViewStackNavigator,
			navigationOptions : {
				title: 'Vaata',
			}
		},
		AddStackNavigator: {
			screen: AddStackNavigator,
			navigationOptions : {
				title: 'Lisa',
			}
		},
	},
	{
		initialRouteName: 'ViewStackNavigator',
		tabBarOptions: {
			style: {
				backgroundColor: '#168bde',
			},
		}
	}
);

const PlayersMain = createAppContainer(PlayersTopTabNavigator);

export default PlayersMain
