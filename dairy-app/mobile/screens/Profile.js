import React, { useState , useEffect, useMemo, useContext, createContext, useRef , useLayoutEffect } from "react";
import { View, Text, StyleSheet ,ScrollView } from "react-native";
import { Avatar, ListItem, Icon } from 'react-native-elements';
import RouteService from "../services/route.service";
import ProjectData from '../screens/daily-delivery.component';

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

    useEffect(() => {
      RouteService.getAll().then(response => {
        var routes = response.data;
		    console.log(routes);
        setRows(routes);
      })
      .catch(e => {
        console.log(e);
      });
	  
    }, [props]);

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
            rows.map((l, i) => (
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
                  <ListItem.Title>{l.name}</ListItem.Title>                                    
                </ListItem.Content>
                <ListItem.Input style={styles.text} keyboardType="numeric"></ListItem.Input>
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
   }
 })