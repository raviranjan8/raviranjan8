import 'react-native-gesture-handler';
import * as React from 'react';
import { useWindowDimensions, Button , TouchableOpacity, StyleSheet} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { getHeaderTitle } from '@react-navigation/elements';
import ProfileScreen from './screens/Profile';
import SettingsScreen from './screens/Settings';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import SavedScreen from './screens/Saved';
import OrderScreen from './screens/Orders';
import ProjectData from './screens/daily-delivery.component';
import ProductsList from './screens/ProductsList';
import ProductDetails from './screens/ProductDetails';
import {Cart} from './screens/Cart';
import Header from './components/Header';
import DrawerItems from './constants/DrawerItems';
import { CartProvider } from './components/CartContext';
import { CartIcon } from './components/CartIcon';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function ProductNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductsList" component={ProductsList} 
          options={({ navigation,  route }) => ({
                headerShown: false,  
          })}
      />
      <Stack.Screen name="ProductDetails" component={ProductDetails} 
          options={({ navigation,  route }) => ({
            headerShown: true,
          })}
      />
      <Stack.Screen name="Cart" component={Cart} 
          options={({ navigation,  route }) => ({
            headerShown: true,
          })}
      />
    </Stack.Navigator>
  );
}

function RouteNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Route" component={ProfileScreen} 
          options={({ navigation,  route }) => ({
                headerShown: false,  
          })}
      />
      <Stack.Screen name="RouteDelivery" component={ProjectData} 
          options={({ navigation,  route }) => ({
            headerShown: true,
          })}
      />
    </Stack.Navigator>
  );
}


export default function App() {
	const dimensions = useWindowDimensions();

  const isLargeScreen = dimensions.width >= 768;

	
 return (
  <CartProvider>
<NavigationContainer>
<Drawer.Navigator    
       initialRouteName="Route"
       screenOptions={{
		      drawerType: isLargeScreen ? 'back' : 'front',
         activeTintColor: '#e91e63',
         itemStyle: { marginVertical: 10 },
       }}>
         
       <Drawer.Screen name="Products" component={ProductNav} 
            options={({ navigation,  route }) => ({
              drawerIcon: ({focused}) => <MaterialCommunityIcons name='shopping'
                          size={24}  color={focused ? "#e91e63" : "black"} />,
              headerRight: () => <CartIcon navigation={navigation}/>,
            })}/>
        <Drawer.Screen name="Routes" component={RouteNav} 
            options={({ navigation,  route }) => ({
              drawerIcon: ({focused}) => <MaterialCommunityIcons name='routes'
                          size={24}  color={focused ? "#e91e63" : "black"} />,
            })}/>
        <Drawer.Screen name="Orders" component={OrderScreen} 
            options={({ navigation,  route }) => ({
              drawerIcon: ({focused}) => <MaterialCommunityIcons name='cart'
                          size={24}  color={focused ? "#e91e63" : "black"} />,
            })}/>
      
</Drawer.Navigator>
</NavigationContainer>
</CartProvider>
 );
}


const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20
  }
});