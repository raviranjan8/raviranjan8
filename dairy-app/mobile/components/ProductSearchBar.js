import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Badge, Icon, withBadge, SearchBar } from 'react-native-elements';
import { CartContext } from './CartContext';
import { NotificationDisplay } from './OrderIcon';
import { CommonActions, StackActions  } from '@react-navigation/native';

export function ProductSearchBar({navigation, route}, props) {
  const {getItemsCount, getCounter, resetNotificationCount, getOrders} = useContext(CartContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const toggleModalVisibility = () => {
		setModalVisible(!isModalVisible);
	};
  const close = () => {
		toggleModalVisibility();
    resetNotificationCount();
	};

  const updateSearch = (value) => {
    setSearch(value);
  }

  const searchProduct = (value) => {
    navigation.dispatch(
      CommonActions.navigate(
        'Products',
        {screen: 'ProductsList',
        params: {
          search: value,
        }
        }
      )
    );
  }
  const clear = () => {
		console.log("Clear");
    setSearch("");
    searchProduct("");
	};
 

  return (
    <View style={styles.viewWrapper}>
      
        <SearchBar         
          platform="android"
          inputStyle={{left: -20, bottom:1, width:100}}
          containerStyle={{ width:150,bottom:3,  }}
          placeholder="Product"
          onChangeText={(value) => updateSearch(value)}
          value={search}
          onClear={() => clear()}
          onBlur={() => searchProduct(search)}
          
        />
    </View>
  );
}

const styles = StyleSheet.create({  
  viewWrapper: {
    flex: 1,
    flexDirection: 'row',
    left: -20,
 },
});
