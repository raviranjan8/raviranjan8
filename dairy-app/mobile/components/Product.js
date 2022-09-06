import React, {useEffect, useState, useContext} from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {baseURL} from "../http-common";
import { CartContext } from '../components/CartContext';
import {  Button} from 'react-native-elements';

export function Product({product,  onPress}) {

  const { addItemToCart } = useContext(CartContext);

  function onAddToCart() {
    addItemToCart(product);
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.listItem}>
      <Image
        style={styles.thumb}
        source={{uri: product.imagePath ? ( product.imagePath.startsWith('http') ? product.imagePath
                                      : (baseURL+'static/images/SP_'+ product.id + '_' + product.imagePath)
                                    ) : (baseURL+'static/images/P_'+ product.product.id + '_' + product.product.imagePath)}}
      />
      <View style={styles.infoContainer} >
        <View  style={styles.lineLeft} >
          <Text style={styles.name}>{product.product.name} - {product.description}</Text>
          <Text style={styles.price}>{product.mrp ? 'MRP'+product.mrp : ''} {product.weight}{product.unit}  Rs{product.rate} {product.stockQuantity<1 ? ' Out Of Stock' : ''}</Text>
        </View>
        <View style={styles.lineRight}>
          <Button        disabled={product.stockQuantity<1 ? true : false}
                          buttonStyle={{
                            backgroundColor: 'rgba(199, 43, 98, 1)',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 30,
                          }}
                          containerStyle={{
                            width: 100,
                            marginHorizontal: 10,
                          }}
                          title="Add to cart" onPress={onAddToCart}></Button>
        </View>
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
    marginVertical: 10,
  },
  thumb: {
    height: 160,
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
  listItem: {
    maxWidth: Dimensions.get('window').width /2,
    flex:0.5,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 16,
}
});
