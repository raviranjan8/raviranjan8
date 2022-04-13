import React, { useEffect, useState, useContext } from 'react';
import { View, Text,TextInput, FlatList, StyleSheet, Modal, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from '../components/CartContext';
import OrderService from "../services/order.service";
import {  Input, Button } from 'react-native-elements';

const { width } = Dimensions.get("window");

export function Cart ({props, navigation}) {

  const {items, getItemsCount, getTotalPrice, clearCart} = useContext(CartContext);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@user_Key', jsonValue)
    } catch (e) {
      console.log(e);
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_Key');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log(e);
    }
  }

	const [isModalVisible, setModalVisible] = useState(false);
	const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState();

	const toggleModalVisibility = () => {
		setModalVisible(!isModalVisible);
	};

  const onOrder = async () => {
    if(items.length>0){
      const user = await getData();
      
      if(!user || !user.mobile){
        toggleModalVisibility();
      }else{
        setInputValue(user.mobile)
        toggleModalVisibility();
      }
    }
  }

  const finalOrder = () => {
    var orderDetails = new Array(items.length);
    items.map((item, index) => {
      orderDetails[index]={};
      orderDetails[index].sellerProduct = {};
      orderDetails[index].sellerProduct.id = item.product.id;
      orderDetails[index].price = item.rate;
      orderDetails[index].totalPrice = item.totalPrice;
      orderDetails[index].quantity = item.qty;
    });

    var data = {
      mobile: inputValue,
      totalPrice: getTotalPrice(),
      totalQuantity: getItemsCount(),
      orderDetails:orderDetails
    };

    OrderService.create(data).then(showResponse);
  }

  const showResponse = (response1) => {
      if(response1.data){
        setMessage('Order placed successfully.');
        clearCart();
      }
  };

  const proceedWithOrder = () => {
		toggleModalVisibility();
    var user = {
      mobile: inputValue
    }
    storeData(user) ;
    finalOrder();
	};
  
  function Totals() {
    let [total, setTotal] = useState(0);
    useEffect(() => {
      setTotal(getTotalPrice());
    });
    return (
       <View style={styles.cartLineTotal}>
          <Text style={[styles.lineLeft, styles.lineTotal]}>Total</Text>
          <Text style={styles.lineRight}>Rs {total}</Text>
       </View>
    );
  }

  function renderItem({item}) {
    return (
       <View style={styles.cartLine}>
          <Text style={styles.lineLeft}>{item.product.product.name} x {item.qty}</Text>
          <Text style={styles.lineRight}>Rs {item.totalPrice}</Text>
       </View>
    );
  }
  
  return (
   
      <View>
        <FlatList
          style={styles.itemsList}
          contentContainerStyle={styles.itemsListContainer}
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.product.id.toString()}
          ListFooterComponent={Totals}
        />

        <Button        
                          buttonStyle={{
                            backgroundColor: 'rgba(199, 43, 98, 1)',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 30,
                          }}
                          containerStyle={{
                            width: 200,
                            marginHorizontal: 80,
                          }}
                          title="Order" onPress={onOrder}></Button>
        {message?(
          <Text  style={styles.message}   >{message}</Text>
        ) : null
        }
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
                  <View style={styles.cartLine}>
                    <Button title="Order"  onPress={proceedWithOrder} />
                    <Text>{'  '}</Text>
                    <Button title="Cancel"  onPress={toggleModalVisibility} />
                    <Text>{'  '}</Text>
                    <Button title="Clear"  onPress={clearCart} />
                  </View>
              </View>
            </View>
			</Modal>
      </View>
    
  );
}

const styles = StyleSheet.create({
  cartLine: { 
    flexDirection: 'row',
  },
  cartLineTotal: { 
    flexDirection: 'row',
    borderTopColor: '#dddddd',
    borderTopWidth: 1
  },
  lineTotal: {
    fontWeight: 'bold',    
  },
  lineLeft: {
    fontSize: 20, 
    lineHeight: 40, 
    color:'#333333' 
  },
  lineRight: { 
    flex: 1,
    fontSize: 20, 
    fontWeight: 'bold',
    lineHeight: 40, 
    color:'#333333', 
    textAlign:'right',
  },
  itemsList: {
    backgroundColor: '#eeeeee',
  },
  itemsListContainer: {
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
