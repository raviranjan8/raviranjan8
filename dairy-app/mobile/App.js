import 'react-native-gesture-handler';
import * as React from 'react';
import { useWindowDimensions, Button , TouchableOpacity, StyleSheet} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { getHeaderTitle } from '@react-navigation/elements';
import ProfileScreen from './screens/Profile';
import SettingsScreen from './screens/Settings';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import SavedScreen from './screens/Saved';
import ReferScreen from './screens/Refer';
import ProjectData from './screens/daily-delivery.component';
import Header from './components/Header';
import DrawerItems from './constants/DrawerItems';

const Drawer = createDrawerNavigator();

export default function App() {
	const dimensions = useWindowDimensions();

  const isLargeScreen = dimensions.width >= 768;

	
 return (
<NavigationContainer>
<Drawer.Navigator    
       initialRouteName="Route"
       screenOptions={{
		      drawerType: isLargeScreen ? 'back' : 'front',
         activeTintColor: '#e91e63',
         itemStyle: { marginVertical: 10 },
       }}
>
       {
         DrawerItems.map(drawer=>
		      <Drawer.Screen
           key={drawer.name}
           name={drawer.name}
           options={({ navigation,  route }) => ({
           drawerIcon:({focused})=>
            drawer.iconType==='Material' ?
            <MaterialCommunityIcons
                    name={drawer.iconName}
                    size={24}
                    color={focused ? "#e91e63" : "black"}
                />
           :
           drawer.iconType==='Feather' ?
            <Feather
                    name={drawer.iconName}
                    size={24}
                    color={focused ? "#e91e63" : "black"}
                  />
                :
			      <FontAwesome5
               name={drawer.iconName}
               size={24}
               color={focused ? "#e91e63" : "black"}
             />
           ,
			
            headerShown:true,
            headerStyle: {
              backgroundColor : "grey5"              
            },
           })}
           component={
             drawer.name==='Route' ? ProfileScreen
               : drawer.name==='Settings' ? SettingsScreen
                 : drawer.name==='Saved Items' ? SavedScreen
                    : drawer.name==='RouteDelivery' ? ProjectData
                     : ReferScreen
           }
         />)
       }
</Drawer.Navigator>
</NavigationContainer>
 );
}
