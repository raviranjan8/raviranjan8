import React, {useEffect, useState, useContext} from 'react';
import {
  Text, 
  Image, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Button, 
  StyleSheet
  } from 'react-native';

import { getProduct } from '../services/ProductsService.js';
import { CartContext } from '../components/CartContext';

import {baseURL} from "../http-common";

export default function ProductDetails({props, route}) {
  const { productData, productProductData } = route.params;
  const [product, setProduct] = useState({});
  const [productInfo, setProductInfo] = useState({});
  
  const { addItemToCart } = useContext(CartContext);
  
  useEffect(() => {
    setProduct(productData);
    setProductInfo(productProductData);
  },[props]);
  
  function onAddToCart() {
    addItemToCart(product);
  }
  
  return (
    <SafeAreaView>
      <ScrollView>
        <Image
          style={styles.image}
          source={{uri: product.imagePath ? ( product.imagePath.startsWith('http') ? product.imagePath
                                      : (baseURL+'static/images/SP_'+ product.id + '_' + product.imagePath)
                                    ) : (baseURL+'static/images/P_'+ productInfo.id + '_' + productInfo.imagePath)}}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{productInfo.name} - {product.description}</Text>
          <Text style={styles.price}>{product.weight}{product.unit}  Rs {product.rate}</Text>
          <Text style={styles.price}>{product.mrp ? 'MRP '+product.mrp : ''} {product.quantity ? 'Quantity'+product.quantity : ''}</Text>
          <Text style={styles.name}>{product.stockQuantity<1 ? ' Out Of Stock' : ''}</Text>
            <Button style={styles.button} disabled={product.stockQuantity<1 ? true : false}
                  onPress={onAddToCart} title="Add to cart" />
                  
        </View>
      </ScrollView>
    </SafeAreaView>
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
  image: {
    height: 300,
    width: '100%'
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
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#787878',
    marginBottom: 16,
  },
  button:{
    borderRadius: 30,
    justifyContent: 'space-around',
  },
});
