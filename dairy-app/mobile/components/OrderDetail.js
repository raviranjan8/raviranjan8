import React, {useEffect, useState, useContext} from 'react';
import {Text,Button, Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {baseURL} from "../http-common";

export function OrderDetail(props, onPress) {

  return (
    <TouchableOpacity style={styles.card} >
      <View style={styles.infoContainer} >
        <View  style={styles.cartLine} >
          <Text style={styles.lineLeft}>{props.order.name}</Text>
          <Text style={styles.lineRight}>{props.order.mobile}</Text>
        </View>
        <View  style={styles.cartLine} >
          <Text style={styles.lineLeft}>{props.order.totalQuantity}</Text>
          <Text style={styles.lineRight}>Rs {props.order.totalPrice}</Text>
        </View>
        {props.order.orderDetails.length>1 && props.order.orderDetails.map((detail) => {
            return (
              <View style={styles.cartLine} key={detail.id}>
                  <Text style={[styles.lineLeft, styles.lineTotal]}>{detail.quantity}</Text>
                  <Text style={styles.lineRight}>Rs {detail.totalPrice}</Text>
              </View>
            );
          })}
          <View  style={styles.cartLine} >
              <Text style={[styles.lineLeft, styles.name]}>{props.order.addresse}</Text>
              <Text style={styles.lineRight}>{props.order.createdDate}</Text>
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
});
