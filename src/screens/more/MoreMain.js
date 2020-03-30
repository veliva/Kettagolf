import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import LandingScreen from './LandingScreen'
import AboutScreen from './AboutScreen'
import EditDataScreen from './EditData'

const MoreStack = createStackNavigator(
    {
        Landing: {
            screen: LandingScreen,
            navigationOptions: {
                title: 'Valikud'
            }
        },
        About: {
            screen: AboutScreen,
            navigationOptions: {
                title: 'Rakenduse info'
            }
        },
        EditData: {
            screen: EditDataScreen,
            navigationOptions: {
                title: 'Muuda andmeid'
            }
        },
    },
    {
        initialRouteName: 'Landing',
    }
);

const MoreMain = createAppContainer(MoreStack);

export default MoreMain