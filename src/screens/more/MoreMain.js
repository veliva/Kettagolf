import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import LandingScreen from './LandingScreen'
import AboutScreen from './AboutScreen'

const MoreStack = createStackNavigator(
    {
        Landing: {
            screen: LandingScreen,
            navigationOptions: {
                title: 'Muu'
            }
        },
        About: {
            screen: AboutScreen,
            navigationOptions: {
                title: 'Rakenduse info'
            }
        }
    },
    {
        initialRouteName: 'Landing',
    }
);

const MoreMain = createAppContainer(MoreStack);

export default MoreMain