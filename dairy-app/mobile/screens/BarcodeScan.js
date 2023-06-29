import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {  Input,  SearchBar,  Icon,  Button,  ThemeProvider,  InputProps,} from 'react-native-elements';
import { BarCodeScanner } from 'expo-barcode-scanner';
import SellerProductService from "../services/seller.product.service";
import ProductService from "../services/product.service";
import { useFocusEffect } from "@react-navigation/native";
import StockService from "../services/stock.service";

export default function BarcodeScan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [productFound, setProductFound] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [barcode, setBarcode] = useState("");

  

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        scanNew();
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();

      return () => {
      };
    }, [])
  );

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setProductFound(true);
    setBarcode(data);
    checkProduct(data);
  };

  function scanNew(data){
    setScanned(false);
    setProductFound(false);
    setQuantity("1");
    setProductName("");
    setProductId("");
    setBarcode("");
  }
  
  function checkProduct(data){
    var param = {
      barcodeNo : data
    }
    SellerProductService.getAll(param).then((response) => {
        if(response.data){
          setProductId(response.data[0].id);
          setProductName(response.data[0].description);
        }
    })
    .catch((e) => {
      console.log(e);
    }); 
  }

  function addProduct() {
    if(productId){
      addStock(productId);
    }else{
      var data = {
        name: productName,
        barcodeNo: barcode,
        status: 'disabled',
        imagePath: ''
      };

      ProductService.create(data).then(response => {
        data["productId"]=response.data.id;
        console.log(data);
        SellerProductService.create(data)
        .then(response => {
          setProductId(response.data.id);
          addStock(response.data.id);
        })
        .catch(e => {
          console.log(e);
        });
      })
      .catch(e1 => {
        console.log(e1);
      });
    
     
    }
  }
  
function addStock(productId){
  if(productId){
    var data = {
      sellerProductId: productId,
      stockQuantity: quantity
    }
    StockService.create(data).then(response => {
      console.log(response);
      alert(`Product ${productId} added!`);
      scanNew(false);
    })
    .catch(e => {
      console.log(e);
    }); 
  }else{
    console.log("No product id found or created to add stock");
    scanNew(false);
  }
}
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject} />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => scanNew(false)} />}
      {productFound &&(
            <View>
              <Input label="Barcode"  value={barcode}
                onChangeText={(p) => setBarcode(p)} />
              <Input label="Product Name"  value={productName}
                onChangeText={(p) => setProductName(p)} />
              <Input label="Stock" value={quantity}
                        keyboardType={'numeric'}
                        onChangeText={(p) => setQuantity(p)} 
                      />
              <Button buttonStyle={styles.bottom} title={'Add Product'} 
                onPress={() => addProduct()} />
            </View>
      )}

     
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    bottom:{
      borderRadius:30,
      backgroundColor:'rgba(199, 43, 98, 1)'
    }
  });