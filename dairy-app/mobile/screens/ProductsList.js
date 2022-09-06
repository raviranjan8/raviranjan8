import React, {useEffect, useState} from 'react';
import { View, Text,RefreshControl, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Product } from '../components/Product.js';
import { getProducts } from '../services/ProductsService.js';
import SellerProductService from "../services/seller.product.service";

export default function ProductsList ({navigation, route},props) {
  
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
      style={{width: '45%'}} 
      />
    );
  }
  
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
      loadProducts();
  },[props, route]);

  function loadProducts(){
    var param = {
      active: true,
      search: (route.params ? route.params.search: null)
    }
    SellerProductService.getAll(param).then((response) => {
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
      numColumns={2}
      horizontal={false}
      columnWrapperStyle={{justifyContent: 'space-between'}}
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
