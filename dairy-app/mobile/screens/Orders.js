import React, {useEffect, useState} from 'react';
import { View, Text,RefreshControl, FlatList, StyleSheet, Modal, Button, Dimensions } from 'react-native';
import {  Input } from 'react-native-elements';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderDetail } from '../components/OrderDetail';
import OrderService from "../services/order.service";

const { width } = Dimensions.get("window");

export default function OrderList ({props, navigation}) {

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback( async () => {
    setRefreshing(true);
    const user = await getData();
    loadOrders(user);
  }, []);

  function renderProduct({item}) {
    return (
      <OrderDetail order={item} onPress={() => {}}/>
    );
  }
  
  const [products, setProducts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState();

	const toggleModalVisibility = () => {
		setModalVisible(!isModalVisible);
	};

   const proceedWithOrder = () => {
		toggleModalVisibility();
      var user = {
         mobile: inputValue
      }
      storeData(user) ;
      loadOrders(user);
	};

  const getData = async () => {
   try {
     const jsonValue = await AsyncStorage.getItem('@user_Key');
     return jsonValue != null ? JSON.parse(jsonValue) : null;
   } catch(e) {
     console.log(e);
   }
 }
  
 const storeData = async (value) => {
   try {
     const jsonValue = JSON.stringify(value)
     await AsyncStorage.setItem('@user_Key', jsonValue)
   } catch (e) {
     console.log(e);
   }
 }

  useEffect( async () => {
   const user = await getData();
   if(!user || !user.mobile){
     toggleModalVisibility();
   }else{
      loadOrders(user);
   }
  },  [props]);

  function loadOrders(user){
   var param={
      mobile: (user.mobile == 9021717570 ? '' : user.mobile )
   }
   OrderService.getAll(param).then((response) => {
      console.log(response.data);
      setProducts(response.data);
      setRefreshing(false);
    })
    .catch((e) => {
      console.log(e);
    }); 
  }
  
  return (
     <View>
         <FlatList
            style={styles.productsList}
            contentContainerStyle={styles.productsListContainer}
            keyExtractor={(item) => item.id.toString()}
            data={products}
            renderItem={renderProduct}
            refreshControl={
            <RefreshControl
               refreshing={refreshing}
               onRefresh={onRefresh}/>
            }
         />
         <Modal animationType="slide"
            transparent visible={isModalVisible}
            presentationStyle="overFullScreen">
            <View style={styles.viewWrapper}>
              <View style={styles.modalView}>                
                  <Input label="Mobile No"
                        value={inputValue}
                        placeholder="Please enter mobile no." 
                        keyboardType={'numeric'} 
                        onChangeText={(value) => setInputValue(value)}  
                        style={styles.textInput}                    
                      />
                  <Button title="Set Mobile No." onPress={proceedWithOrder} />
              </View>
            </View>
			</Modal>
      </View>

  );
}

const styles = StyleSheet.create({
  productsList: {
    backgroundColor: '#eeeeee',
  },
  productsListContainer: {
    backgroundColor: '#eeeeee',
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  viewWrapper: {
   flex: 1,
   alignItems: "center",
   justifyContent: "center",
   backgroundColor: "rgba(0, 0, 0, 0.2)",
},
modalView: {
   alignItems: "center",
   justifyContent: "center",
   position: "absolute",
   top: "50%",
   left: "50%",
   elevation: 5,
   transform: [{ translateX: -(width * 0.4) },
            { translateY: -90 }],
   height: 180,
   width: width * 0.8,
   backgroundColor: "#fff",
   borderRadius: 7,
},
message: {
 textAlign:'center',
   alignItems: "center",
   justifyContent: "center",
   height: 30,
 margin:20,
   backgroundColor: "#fff",
   borderRadius: 7,
},
textInput: {
   width: "80%",
   borderRadius: 5,
   paddingVertical: 8,
   paddingHorizontal: 16,
   borderColor: "rgba(0, 0, 0, 0.2)",
   borderWidth: 1,
   marginBottom: 8,
},
});
