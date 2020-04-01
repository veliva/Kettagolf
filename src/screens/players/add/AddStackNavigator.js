import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import UserWishesScreen from './UserWishes'
import CourseSelectionScreen from './CourseSelection'
import AdditionalInfoScreen from './AdditionalInfo'
import MyResponseScreen from './MyResponse'

const AddStackNavigator = createStackNavigator(
	{
		UserWishes: {
			screen: UserWishesScreen,
			navigationOptions: {
				title: ''
			}
        },
		CourseSelection: {
			screen: CourseSelectionScreen,
			navigationOptions: {
				title: ''
			}
        },
		AdditionalInfo: {
			screen: AdditionalInfoScreen,
			navigationOptions: {
				title: ''
			}
        },
		MyResponse: {
			screen: MyResponseScreen,
			navigationOptions: {
				title: ''
			}
        },
    },
    {
        initialRouteName: 'UserWishes',
        headerMode: 'none',
        navigationOptions: {
            // headerBackTitleVisible: true,
        }
        
    }
)

const AddStack = createAppContainer(AddStackNavigator);

export default AddStack