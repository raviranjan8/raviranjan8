import React, { useContext,useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Text, Divider, Switch, useTheme } from 'react-native-elements';

import { SafeAreaView } from 'react-native-safe-area-context';
import { CartContext } from '../components/CartContext';

import AuthService from "../services/auth.service";

function CustomContentComponent(props) {

  const {orderAlert, updateOrderAlert, user, setUser} = useContext(CartContext);

  return (
    <SafeAreaView>
      <View style={{ marginLeft: 10, width: '100%' }}>
        <DrawerItemList {...props} />
      </View>
      <Divider style={{ marginTop: 15 }} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          paddingLeft: 25,
          paddingBottom: 5,
        }}>
        <Text style={{ marginTop: 15, }}> Order Alert </Text>
        <Switch
          style={{
            position: 'absolute',
            right: 5,
          }}
          value={orderAlert}
          onValueChange={(value) => {updateOrderAlert(value,user)}}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          paddingLeft: 25, 
        }}>
        <TouchableOpacity>
         {user && user.accessToken ? (
           <Text style={{ marginTop: 15, }} 
                onPress={() => {AuthService.logout(); setUser(null); props.navigation.navigate("Login");}}> 
           Logout</Text>
         ):(
          <Text style={{ marginTop: 15, }} 
                    onPress={() => {AuthService.logout(); props.navigation.navigate("Login")}}> 
                    Login</Text>
         )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <CustomContentComponent {...props} />
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;