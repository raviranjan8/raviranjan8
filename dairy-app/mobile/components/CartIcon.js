import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Badge, Icon, withBadge, SearchBar } from 'react-native-elements';
import { CartContext } from './CartContext';
import { NotificationDisplay } from './OrderIcon';

export function CartIcon({navigation}) {
  const {getItemsCount, getCounter, resetNotificationCount, getOrders} = useContext(CartContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState();

  const toggleModalVisibility = () => {
		setModalVisible(!isModalVisible);
	};
  const close = () => {
		toggleModalVisibility();
    resetNotificationCount();
	};

  const updateSearch = (value) => {
		console.log(value);
    setSearch(value);
	};

  return (
    <View style={styles.viewWrapper}>
        
        <View style={styles.container}>
          <Text style={styles.text} 
            onPress={() => {
              navigation.navigate('Cart');
            }}
          >Cart ({getItemsCount()})</Text>

        </View>
            
        <View style={styles.containerBell}> 
        <Avatar
            rounded
            source={require('../assets/bell-regular.png')}
            size="small"
            onPress={toggleModalVisibility}
          />
          <Badge
            status="primary"
            value={getCounter()}
            containerStyle={{ position: 'absolute', top: 5, left: 30 }}
          />

          <NotificationDisplay close={close} isModalVisible={isModalVisible} ></NotificationDisplay>
      
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    marginVertical:5,
    backgroundColor: 'orange',
    height: 42,
    padding: 8,
    borderRadius: 32 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerBell: {
    alignItems: 'center',
    padding: 8,
    marginVertical:3,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize:15,
  },
  viewWrapper: {
    flex: 1,
    flexDirection: 'row'
 },
});
