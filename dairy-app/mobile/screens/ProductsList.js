import React, {useEffect, useState} from 'react';
import { View, Text,RefreshControl, FlatList, StyleSheet } from 'react-native';

import { Product } from '../components/Product.js';
import { getProducts } from '../services/ProductsService.js';
import SellerProductService from "../services/seller.product.service";

export default function ProductsList ({props, navigation}) {

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadProducts();
  }, []);

  function renderProduct({item: product}) {
    return (
      <Product product= {product} 
      onPress={() => {
        navigation.navigate('Products', {
          screen: 'ProductDetails' ,
          params: {productData: product, productProductData: product.product}
        });
      }}
      />
    );
  }
  
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    //setProducts(getProducts());
    loadProducts();
  },  [props]);

  function loadProducts(){
    SellerProductService.getAll().then((response) => {
      setProducts(response.data);
      setRefreshing(false);
    })
    .catch((e) => {
      console.log(e);
    }); 
  }
  
  return (
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
});
