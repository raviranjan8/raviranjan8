import  React , { useState} from 'react';
import { View, Text,RefreshControl, FlatList, StyleSheet, Modal, Button, Dimensions } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import {getData} from "../components/Storage";
import { OrderDetail } from '../components/OrderDetail';
import OrderService from "../services/order.service";

const { width } = Dimensions.get("window");

export default function OrderList ({props, navigation}) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [savedUser, setSavedUser] = React.useState();
  const [role, setRole] = React.useState("customer");

  const onRefresh = React.useCallback( async () => {
    setRefreshing(true);
    loadOrders();
  }, []);

  function renderProduct({item}) {
    return (
      <OrderDetail order={item} onLoadOrders={loadOrders} role={role}/>
    );
  }
  
  const [products, setProducts] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const userTemp = getData();
      userTemp.then(user => {
          if(user.username){
            setSavedUser(user);
            if(user.roles.includes("admin")){
              setRole("admin");
             }
            loadOrders(user);
          }
      });
      return () => {
      };
    }, [])
  );

  function loadOrders(user){
    if(!user){
        user = savedUser;
    }
   var param={
      mobile: user.username 
   }
   OrderService.getAll(param).then((response) => {
      //console.log(response.data);
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
           
            data={products}
            renderItem={renderProduct}
            refreshControl={
            <RefreshControl
               refreshing={refreshing}
               onRefresh={onRefresh}/>
            }
         />
         
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
