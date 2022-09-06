import React, { useEffect, useState, useContext } from 'react';
import { View, Text,TextInput, FlatList, StyleSheet, Modal, Dimensions } from 'react-native';
import { CartContext } from '../components/CartContext';
import OrderService from "../services/order.service";
import {  Input, Button } from 'react-native-elements';
import CustomerService from "../services/customer.service";
import AuthService from "../services/auth.service";
import {getData, storeData} from "../components/Storage";
import moment from "moment";

const { width } = Dimensions.get("window");


export function Cart ({props, navigation}) {

  const {items, getItemsCount, getTotalPrice, clearCart, user, setUser} = useContext(CartContext);
	const [isModalVisible, setModalVisible] = useState(false);
	const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState();
  const [otp, setOtp] = useState();
  const [otpSent, setOtpSent] = useState(false);
  const [authorized, setAuthorized] = useState(false);

	const toggleModalVisibility = () => {
		setModalVisible(!isModalVisible);
	};

  const getOtp = () => {
    var loginParam = {
      username : inputValue
    };
    AuthService.register(loginParam).then((response) => {
      setOtpSent(true);
      setMessage("Otp sent to your mobile. Kindly check and enter the OTP here.");
    }).catch((error) => {
      const resMessage =  (error.response &&  error.response.data &&  error.response.data.message) 
                                      || error.message ||  error.toString();
        setMessage(resMessage);
    });
  }

  const submitOtp = () =>{
    var loginParam = {
      username : inputValue,
      password : otp
    };
    AuthService.login(loginParam).then(
      (response) => {
          setAuthorized(true);
          setUser(response);
          getCustomerData(response);
      },
      (error) => {
        const resMessage =  (error.response &&  error.response.data &&  error.response.data.message) 
                                      || error.message ||  error.toString();
        setMessage(resMessage);
      }
    );
  }

  const getCustomerData = (userData) =>{
    var userTemp = userData;
    const params ={ "mobNo" : inputValue };
          CustomerService.getAll(params).then(response => {
            var savedUser = response.data[0];
            if(savedUser){
              setName(savedUser.name);
              setAddress(savedUser.address);
              userTemp.name=savedUser.name;
              userTemp.address = savedUser.address;
              userTemp.partyId = savedUser.id;
              setUser(userTemp);
            }
          })
          .catch(e => {
          console.log(e);
          });
  }

  const onOrder =  () => {
    if(items.length>0){
      getData().then(userStore => {
        if(!userStore || !userStore.accessToken){
          toggleModalVisibility();
        }else{
          setUser(userStore);
          if(!userStore.name){
            getCustomerData(userStore);
          }else{
            setName(userStore.name)
            setAddress(userStore.address)
          }
          setOtpSent(true);
          setAuthorized(true);
          setInputValue(userStore.username)
          toggleModalVisibility();
        }
      })
    }
  }

  const proceedWithOrder = () => {
		toggleModalVisibility();
    var userTemp = user;
    if(userTemp.partyId){
      userTemp.mobile = inputValue;
      userTemp.name = name;
      userTemp.address = address;
      userTemp.type = user.type;
      storeData(userTemp) ;
      finalOrder(userTemp);
    }else{
      var data = {
        name: name,
        address: address,
        mobNo: inputValue,
        startDate: moment().format("DD-MMM-YYYY"),
        active: true,
        type: 'customer'
      };
      CustomerService.create(data).then(response => {
            userTemp.mobile = inputValue;
            userTemp.name = name;
            userTemp.address = address;
            userTemp.type = user.type;
            userTemp.partyId=response.data.id;
            storeData(userTemp) ;
            finalOrder(userTemp);
        }).catch(e => {
          console.log(e);
        });
    } 
	};

  const finalOrder = (userTemp) => {
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
      partyId: userTemp.id,
      name: name,
      address: address,
      totalPrice: getTotalPrice(),
      totalQuantity: getItemsCount(),
      status: 'Ordered',
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
                {authorized ? (
                  <Input label="Name"
                        value={name}
                        placeholder="Please enter Name" 
                        onChangeText={(value) => setName(value)}  
                        style={styles.textInput}                    
                      />
                ) : null}
                {authorized ? (
                  <Input label="Address"
                        value={address}
                        placeholder="Please enter Address" 
                        onChangeText={(value) => setAddress(value)}  
                        style={styles.textInput}                    
                      />
                ) : null}
                {authorized ? (
                  <View style={styles.cartLine}>
                    <Button title="Order"  onPress={proceedWithOrder} />
                    <Text>{'  '}</Text>
                    <Button title="Cancel"  onPress={toggleModalVisibility} />
                    <Text>{'  '}</Text>
                    <Button title="Clear"  onPress={()=>{toggleModalVisibility();clearCart();}} />
                  </View>
                 ) : otpSent ? (
                        <Input label="OTP"
                            value={otp}
                            placeholder="Please enter OTP" 
                            onChangeText={(value) => setOtp(value)}  
                            style={styles.textInput}
                            keyboardType={'numeric'} 
                          />
                ) : null}
                {otpSent && !authorized ? (
                        <Button title="Submit OTP"  onPress={submitOtp} />
                ) : null}
                {!otpSent ? (
                      <View style={styles.cartLine}>
                            <Button title="Get OTP"  onPress={getOtp} />
                            <Text>{'  '}</Text>
                            <Button title="Cancel"  onPress={toggleModalVisibility} />
                      </View>
                ) : null}
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
		
		width: width * 0.8,
		backgroundColor: "#fff",
		borderRadius: 7,
	},
  modalViewInside: {
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		top: "160%",
		left: "50%",
    elevation: 5,
		transform: [{ translateX: -(width * 0.4) },
					{ translateY: -90 }],
		
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
