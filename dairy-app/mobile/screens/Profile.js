import React, { useState , useEffect, useMemo, useContext, createContext, useRef , useLayoutEffect } from "react";
import { View, Input,Text, StyleSheet ,ScrollView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Avatar, ListItem, Icon } from 'react-native-elements';
import RouteService from "../services/route.service";
import RouteStockService from "../services/route.stock.service";
import moment from 'moment';

export default function ProfileScreen({ props, navigation }) {

  const InputFieldsStyle = {
    borderWidth: 0,
  };

  const [rows, setRows] = useState([]);
    
    Array.prototype.chunk = function ( n ) {
        if ( !this.length ) {
            return [];
        }
        return [ this.slice( 0, n ) ].concat( this.slice(n).chunk(n) );
    };  

   

    useFocusEffect(
      React.useCallback(() => {
        getData();
        return () => {
        };
      }, [])
    );

    function getData(){
      var currentDate = moment();
      const param = {
        date: currentDate.format("DD") ,
        month: currentDate.format("MMM-YYYY") , 
        type: "income"
      };

      RouteService.getAll(param).then(response => {
        var routes = response.data;
		    console.log(routes);       
        setRows(routes);
        routeStockService(param, routes);
      })
      .catch(e => {
        console.log(e);
      });
    }

    function routeStockService(param, initialRows){
      RouteStockService.getAll(param).then((response) => {
        var stocks = response.data;        
        stocks &&  stocks.map((stock, index) => {
          for(var initialRow of initialRows){
            if(initialRow.id == stock.routeId){
              initialRow["quantity"]=stock.quantity+'';
              initialRow["routeStockId"]=stock.id;
              break;
            }
          };
        });
        if(initialRows){
          setRows(initialRows.slice());
        }
      })
      .catch((e) => {
        console.log(e);
      });   
    }  
  
    function onChangeQuantity(input, routeId, stockId, row){
      saveRoute(input, routeId, stockId, row);
    }

    function saveRoute(input, routeId, stockId,row) {   
        var data = {
          id: stockId,
          routeId: routeId,
          quantity: +input,
          date: moment().format("DD"),
          month: moment().format("MMM-YYYY")
        };
        if(data.id){
          RouteStockService.update(data.id, data)
          .then(response => {
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
        }else{
          RouteStockService.create(data)
          .then(response => {            
            row.routeStockId = response.data.id;
            console.log(row);
          })
          .catch(e => {
            console.log(e);
          });
        }
    }
  
   return (
<>
      <ScrollView>
        {/* {rows.chunk(3).map((chunk, chunkIndex) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 30,
            }}
            key={chunkIndex}
          >
            {chunk.map((l, i) => (
              <Avatar
                size={64}
                rounded
                containerStyle={{ backgroundColor: '#1F1A24' }}
                title={l.name}
                key={`${chunkIndex}-${i}`}
                onPress={() => {navigation.navigate('RouteDelivery', { id: l.id })}}
                titleStyle={{fontSize:15 }}
              >
              </Avatar>
            ))}
          </View>
        ))} */}

        <View>
          {
            rows && rows.map((l, i) => (
              <ListItem key={i} bottomDivider>
                <Avatar
                    size={64}
                    rounded
                    containerStyle={{ backgroundColor: '#1F1A24' }}
                    title={l.name}
                    key={`${i}-${i}`}
                    onPress={() => {navigation.navigate('RouteDelivery', { id: l.id })}}
                    titleStyle={{fontSize:15 }}
                  >
                  </Avatar> 
                <ListItem.Content>                
                  <ListItem.Title>{l.extraInfo ? l.extraInfo.payment: null}</ListItem.Title>
                  <ListItem.Subtitle>{''}</ListItem.Subtitle>
                </ListItem.Content>                 
                <ListItem.Content>
                      <ListItem.Title>{l.extraInfo ? l.extraInfo.customerDeliveredCount: null}</ListItem.Title>
                      <ListItem.Subtitle>{l.extraInfo ? l.extraInfo.customerDeliveredQuantity: null}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Content>
                  <ListItem.Title onPress={() => {navigation.navigate('RouteDelivery', { id: l.id, pending:'pending' })}}>
                    {l.extraInfo ? l.extraInfo.customerPendingCount: null}
                  </ListItem.Title> 
                  <ListItem.Subtitle>{l.extraInfo ? l.extraInfo.customerPendingQuantity: null}</ListItem.Subtitle>                  
                </ListItem.Content>
                <ListItem.Content>                
                    <ListItem.Input style={styles.text} keyboardType="numeric" defaultValue={l.quantity} 
                      onChangeText={value => onChangeQuantity(value, l.id, l.routeStockId, l)}  >
                    </ListItem.Input>                    
                    <ListItem.Subtitle>{''}</ListItem.Subtitle>
                </ListItem.Content>
                
              </ListItem>
            ))
          }
        </View>
      </ScrollView>
    </>
   );
 }

 const styles = StyleSheet.create({
   subHeader: {
     backgroundColor : "#2089dc",
     color : "white",
     textAlign : "center",
     paddingVertical : 5,
     marginBottom : 10
   },
   text: {
    borderColor: '#cbd2d9',
    borderWidth: 1,
    maxWidth:50,
    textAlign : "center",
   },
   subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  }
 })