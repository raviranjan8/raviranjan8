import React, {useEffect, useState, useContext} from 'react';
import {Text,Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {  Input,  SearchBar,  Icon,  Button,  ThemeProvider,  InputProps,} from 'react-native-elements';
import {baseURL} from "../http-common";

import OrderService from "../services/order.service";

export function OrderDetail(props) {

  function updateOrder(id, status){
    var param={
       id: id 
    }
    OrderService.updateStatus(id, status,param).then((response) => {
      props.order.status=status;
       alert("Order status updated.");
       props.onLoadOrders();
     })
     .catch((e) => {
      alert("Order status update FAILED.");
       console.log(e);
     }); 
    
   }

  return (
    <TouchableOpacity style={styles.card} >
      <View style={styles.infoContainer} >
        <View  style={styles.cartLine} >
          <Text style={styles.lineLeft}>{props.order.name} - {props.order.mobile}</Text>
          <Text style={styles.lineRight}>{props.order.status}</Text>
        </View>
        {props.order.orderDetails.length>1 ?
          <View  style={styles.cartLine}>
            <Text style={styles.lineLeft}>{props.order.totalQuantity}</Text>
            <Text style={styles.lineRight}>Rs {props.order.totalPrice}</Text>
          </View>
          :null
        }
        {props.order.orderDetails.map((detail) => {
            return (
              <View style={styles.cartLine} key={detail.id}>
                  <Text style={[styles.lineLeft, styles.lineTotal]}>{detail.sellerProduct.product.name}-{detail.sellerProduct.description}</Text>
                  <Text style={styles.lineRight}>Qty{detail.quantity} Rs {detail.totalPrice}</Text>
              </View>
            );
          })}
          <View  style={styles.cartLine} >
              <Text style={[styles.lineLeft, styles.name]}>{props.order.address}</Text>
              <View style={[styles.lineRight, styles.rightWidth]} >
               {props.role == 'admin' ? (      
                  <Button
                  buttonStyle={{
                    backgroundColor: 'rgba(199, 43, 98, 1)',
                    borderColor: 'transparent',
                    borderWidth: 0,
                    borderRadius: 5,
                    width:150,
                    right:-80
                  }}
                  onPress={()=> {updateOrder(props.order.id, (props.order.status=='Ordered' ? 'Confirm':
                  props.order.status=='Confirm' ? 'Dispatch' : 'Delivered'))}}
                  disabled={props.order.status=='Delivered' ? true:false}
                   title={props.order.status=='Ordered' ? 'Confirm':
                                       props.order.status=='Confirm' ? 'Dispatch' : 'Delivered' }></Button>
               ) : null}
              </View>
          </View>
          <View  style={styles.cartLine} >
              <Text style={[styles.lineLeft]}>Order-{props.order.id}</Text>
              <Text style={[styles.lineRight]}>{props.order.createdDate}</Text>
          </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
    marginVertical: 20,
  },
  thumb: {
    height: 260,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cartLine: { 
    flexDirection: 'row',
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
  rightWidth:{
    width:'50%'
  },
});
