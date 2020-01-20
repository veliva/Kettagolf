import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import Loading from './src/screens/userAuth/Loading'
import SignUp from './src/screens/userAuth/SignUp'
import Login from './src/screens/userAuth/Login'
import TabNavigator from './src/navigators/TabNavigator'

const RootStack = createSwitchNavigator(
	{
		Login: Login,
		SignUp: SignUp,
		TabNavigator: TabNavigator,
		Loading: Loading,
	},
	{
		initialRouteName: 'Loading'
	}
)

const App = createAppContainer(RootStack);

export default App