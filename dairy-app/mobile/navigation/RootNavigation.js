import 'react-native-gesture-handler';
import React, { useState, useEffect, useContext} from 'react';
import { useWindowDimensions, View, Text, Switch, Button , TouchableOpacity, StyleSheet} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '../screens/Profile';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import OrderScreen from '../screens/Orders';
import ProjectData from '../screens/daily-delivery.component';
import ProductsList from '../screens/ProductsList';
import BarcodeScan from '../screens/BarcodeScan';
import ProductDetails from '../screens/ProductDetails';
import {Cart} from '../screens/Cart';
import { CartIcon } from '../components/CartIcon';
import { ProductSearchBar } from '../components/ProductSearchBar';
import { OrderIcon } from '../components/OrderIcon';
import { CustomDrawerContent } from './DrawerNavigation';
import Login from '../screens/Login';
import AuthService from "../services/auth.service";
import { CartContext } from '../components/CartContext';
import { SearchBar } from 'react-native-elements';
import MapPath from '../screens/MapPath';

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


export function RootNavigation(props) {

  const [role, setRole] = useState("customer");
  const {user} = useContext(CartContext);

	const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;  

  useEffect( () => {
    AuthService.getCurrentUser().then(user => {
      if(user && user.roles){
       if(user.roles.includes("staff")){
         setRole("staff");
       }
       if(user.roles.includes("admin")){
        setRole("admin");
       }
      }
    });
  },  [props]);
	
 return (
<NavigationContainer>
<Drawer.Navigator    
       initialRouteName="Route"
       drawerContent={CustomDrawerContent}
       headerTitle={()=> {<View><Text fontSize={17}></Text></View>}}
       screenOptions={{
		      drawerType: isLargeScreen ? 'back' : 'front',
         activeTintColor: '#e91e63',
         itemStyle: { marginVertical: 10 },
       }}>
       <Drawer.Screen name="Products" component={ProductNav} initialParams={{'search':''}}
            options={({ navigation,  route }) => ({
              drawerIcon: ({focused}) => <MaterialCommunityIcons name='shopping'
                          size={24}  color={focused ? "#e91e63" : "black"} />,
              headerRight: () => <CartIcon navigation={navigation}/>,
              headerTitle:()=><ProductSearchBar navigation={navigation} route={route}/>,
            })}/>
        {(role.includes("staff") || role.includes("admin")
        || (user && user.roles && user.roles.includes("admin")) ) ? (
          <Drawer.Screen name="Routes" component={RouteNav} 
            options={({ navigation,  route }) => ({
              drawerIcon: ({focused}) => <MaterialCommunityIcons name='routes'
                          size={24}  color={focused ? "#e91e63" : "black"} 
                          />,
              headerRight: () => <OrderIcon navigation={navigation}/>,
            })}/>
        ):null}
        <Drawer.Screen name="Orders" component={OrderScreen} 
            options={({ navigation,  route }) => ({
              drawerIcon: ({focused}) => <MaterialCommunityIcons name='cart'
                          size={24}  color={focused ? "#e91e63" : "black"} />,
              headerRight: () => <OrderIcon navigation={navigation}/>,
            })}/>
         {(role.includes("admin") || (user && user.roles && user.roles.includes("admin")) ) ? (
          <Drawer.Screen name="Barcode" component={BarcodeScan} 
            options={({ navigation,  route }) => ({
              drawerIcon: ({focused}) => <MaterialCommunityIcons name='barcode-scan'
                          size={24}  color={focused ? "#e91e63" : "black"} 
                          />,
              headerRight: () => <OrderIcon navigation={navigation}/>,
            })}/>
        ):null}
        <Drawer.Screen name="Map" component={MapPath} 
            options={({ navigation,  route }) => ({
              drawerIcon: ({focused}) => <MaterialCommunityIcons name='google-maps'
                          size={24}  color={focused ? "#e91e63" : "black"} 
                          />,
              headerRight: () => <OrderIcon navigation={navigation}/>,
            })}/>
        <Drawer.Screen name="Login" component={Login} options={{drawerItemStyle: { display: 'none' }}}/>
</Drawer.Navigator>
</NavigationContainer>
 );
}
export default RootNavigation;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20
  }
});