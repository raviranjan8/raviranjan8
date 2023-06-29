
import  React , {useEffect, useState, useContext} from 'react';
import { View, Text, StyleSheet, Modal, Button, Dimensions } from 'react-native';
import { Avatar, Badge, Input } from 'react-native-elements';

import { CartContext } from './CartContext';

const { width } = Dimensions.get("window");

export function NotificationDisplay({isModalVisible, close}){
    const { getOrders } = useContext(CartContext);
    return (
      <Modal animationType="slide"
           transparent visible={isModalVisible}
           presentationStyle="overFullScreen">
           <View style={styles.viewWrapper}>
             <View style={styles.modalView}>     
                   {getOrders().length >0 && getOrders().map((detail) => {
                     return (           
                     <View  style={styles.cartLine} key={detail.id}>
                       <Text style={styles.lineLeft}>{detail.mobile} </Text>
                       <Text style={styles.lineLeft}>{detail.totalQuantity} </Text>
                       <Text style={styles.lineLeft}>Rs{detail.totalPrice} </Text>
                       <Text style={styles.lineRight}>{detail.JsonData.status}</Text>
                     </View>
                     );
                   })}
                 <Button title="Close" onPress={close} />
             </View>
           </View>
     </Modal>
    );
}

export function OrderIcon({props, navigation}) {

  const { resetNotificationCount, getCounter, orders, getOrders } = useContext(CartContext);
  const [isModalVisible, setModalVisible] = useState(false);
  

  const toggleModalVisibility = () => {
		setModalVisible(!isModalVisible);
	};

  const close = () => {
		toggleModalVisibility();
    resetNotificationCount();
	};



  return (
    <View style={styles.container}>
        
           <Avatar
            rounded
            source={require('../assets/bell-regular.png')}
            size="small"
            onPress={toggleModalVisibility}
          />
          <Badge
            status="primary"
            value={getCounter()}
            containerStyle={{ position: 'absolute', top: 5, left: 30 }}
          />

          <NotificationDisplay close={close} isModalVisible={isModalVisible} ></NotificationDisplay>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    
    height: 42,
    padding: 12,
    borderRadius: 32 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeader: {
    backgroundColor : "#2089dc",
    color : "white",
    textAlign : "center",
    paddingVertical : 5,
    marginBottom : 10
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
    left: "43%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) },
             { translateY: -90 }],
    width: width * 0.95,
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
 cartLine: { 
  width: "92%",
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
})

