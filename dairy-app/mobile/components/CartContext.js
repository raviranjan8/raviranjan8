import React, {createContext, useState, useEffect, useRef} from 'react';

import EventSource from "react-native-sse";
import {baseURL} from "../http-common";

import {storeData} from "../components/Storage";
import {authVerify} from "../services/auth.service";

export const CartContext = createContext();

export  function CartProvider(props) {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const [orderAlert, setOrderAlert] = useState(false);
  const [productAlert, setProductAlert] = useState(false);

  const [esOrder, setEsOrder] = useState();
  const [esProduct, setEsProduct] = useState();

  const [user, setUser] = useState();

  useEffect( () => {
    const userTemp1 = authVerify();
    userTemp1.then(userTemp => {
      setUser(userTemp);
      
      updateOrderAlert(userTemp ? userTemp.orderAlert: false, userTemp);
      updateProductAlert(userTemp ? userTemp.productAlert: false, userTemp);
      
    });
  },  [props]);

  //this method called from Drawer navigation also
  const updateOrderAlert = async (flag, userTemp) => {
    setOrderAlert(flag);
    if(userTemp){
      userTemp.orderAlert = flag;
      setUser(userTemp);
    }else{
      userTemp = {
        orderAlert: flag
      }
    }

    if(flag && userTemp.username){
      var key = userTemp.username;
      if(userTemp.type == 'admin'){
        key = 'ADMIN'+key;
      }
      console.log(userTemp);
      const es = new EventSource(baseURL+"push/sse/"+key , {headers: { Authorization: 'Bearer ' + userTemp.accessToken }});
      setEsOrder(es);
      startAlert(es);
    }else{
      if(esOrder){
        esOrder.close();
      }
    }
    storeData(userTemp) ;
  }

  function updateProductAlert(flag, userTemp){
    setProductAlert(flag);
    if(userTemp){
      userTemp.productAlert = flag;
    }else{  
        userTemp = {
          productAlert: flag
        }
    }
    if(flag && userTemp.username){
      const esProduct = new EventSource(baseURL+"push/sseOther/"+userTemp.username, {headers: { Authorization: 'Bearer ' + userTemp.accessToken }});
      setEsProduct(esProduct);
      startAlert(esProduct);
    }else{
      if(esProduct){
        esProduct.close();
      }
    }
    storeData(userTemp) ;
  }

  function startAlert(es){
    es.addEventListener("open", (event) => {      
      console.log("Open SSE connection.");
    });

    es.addEventListener("message", (event) => {
      addNotificationCount(event.data);
    });

    es.addEventListener("error", (event) => {
      if (event.type === "error") {
        console.error("Connection error:", event.message);
      } else if (event.type === "exception") {
        console.error("Error:", event.message, event.error);
      }
    });
    
    es.addEventListener("close", (event) => {
      console.log("Close SSE connection.");
    });

    return function cleanup() {
      //es.removeAllEventListeners();
      //es.close();
    };
  }

  function clearCart() {
    setItems([]);
  }

  function getCounter(){
    return orders.length;
  }

  function getOrders(){
    return orders;
  }

  function addNotificationCount(data){
    var JsonData = JSON.parse(data);
    setOrders((prevItems) => {
          return [...prevItems, {
              id: JsonData.id,
              totalQuantity: JsonData.totalQuantity,
              mobile: JsonData.mobile,
              JsonData,
              price: JsonData.price,
              totalPrice: JsonData.totalPrice 
          }];
        });
  }

  function resetNotificationCount(){
    setOrders([]);
}


  function addItemToCart(product) {
    setItems((prevItems) => {
      const item = prevItems.find((item) => (item.id == product.id));
      if(!item) {
          return [...prevItems, {
              id: product.id,
              qty: 1,
              product,
              rate: product.rate,
              totalPrice: product.rate 
          }];
      }
      else { 
          return prevItems.map((item) => {
            if(item.id == product.id) {
              item.qty++;
              item.totalPrice += product.rate;
            }
            return item;
          });
      }
    });

  }

  function getItemsCount() {
      return items.reduce((sum, item) => (sum + item.qty), 0);
  }
  
  function getTotalPrice() {
      return items.reduce((sum, item) => (sum + item.totalPrice), 0);
  }  
  
  return (
    <CartContext.Provider value={{items, setItems, getItemsCount, addItemToCart, getTotalPrice, clearCart, resetNotificationCount, getCounter, orders, setOrders, getOrders, orderAlert, updateOrderAlert, productAlert, updateProductAlert, user, setUser}}>
      {props.children}
    </CartContext.Provider>
  );
}

