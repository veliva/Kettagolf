import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import LandingScreen from './LandingScreen'
import testScreen from './Test'

const ViewStackNavigator = createStackNavigator(
	{
		Landing: {
			screen: LandingScreen,
			navigationOptions: {
				title: ''
			}
        },
		test: {
			screen: testScreen,
			navigationOptions: {
				title: '123'
			}
        },
    },
    {
        initialRouteName: 'Landing',
        headerMode: 'none',
        navigationOptions: {
            // headerBackTitleVisible: true,
        }
        
    }
)

const LookStack = createAppContainer(ViewStackNavigator);

export default LookStack