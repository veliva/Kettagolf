import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import LandingScreen from './LandingScreen'
import InterestedScreen from './Interested'

const ViewStackNavigator = createStackNavigator(
	{
		Landing: {
			screen: LandingScreen,
			navigationOptions: {
				title: ''
			}
        },
		Interested: {
			screen: InterestedScreen,
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