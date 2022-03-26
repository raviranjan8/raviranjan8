import React from 'react';
import {View,Text, StyleSheet, TouchableOpacity,Button} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';

const Header = props => {
  return(
		<View style={headerStyles.container}>
			<TouchableOpacity onPress={()=>props.navigation.dispatch(DrawerActions.toggleDrawer())}>
				<Entypo name="menu" size={24} color="black" />
			</TouchableOpacity>
			<View>
				<Text>{props.screen}</Text>
				
			</View>
		</View>
  )
}

 export default Header;

const headerStyles=StyleSheet.create({
   container:{
       position:'absolute',
       top:30,
       left:0,
       width:'100%',
       backgroundColor:'#fa7da7',
       elevation:5,
       height:50,
       display:'flex',
       flexDirection:'row',
       paddingHorizontal:20,
       alignItems:'center',
       justifyContent:'space-between'
   }
})