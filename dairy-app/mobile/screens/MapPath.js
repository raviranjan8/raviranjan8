import  React, { useState, useEffect} from 'react';
import {StyleSheet, View, Text, Platform, PermissionsAndroid, TouchableOpacity,Dimensions } from "react-native";

import MapView, {Marker, AnimatedRegion, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import haversine from "haversine";
import { RecoilRoot, atom, useRecoilValue, useSetRecoilState } from 'recoil';

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;

const LOCATION_TASK_NAME = "background-location-task";

const routeCoordinates = atom({
   key: 'coordinate',
   default: [],
 });

 var routeCoordinatesMap = new Array();

 const pushCoord = async (data) => {
   routeCoordinatesMap = data;
 }

export default function MapPath () {
   const [prevLatLng, setPrevLatLng] = useState();
   const [mapRegion, setMapRegion] = useState(null);
   const [hasLocationPermissions, setHasLocationPermissions] = useState(false);
   const [locationResult, setLocationResult] = useState();

   const setRouteCoordinates = useSetRecoilState(routeCoordinates);
   const routeCoordinatesVal = useRecoilValue(routeCoordinates);

   const _getLocationAsync = async () => {
         let { status } = await Location.requestForegroundPermissionsAsync();
         if (status !== 'granted') {
           setLocationResult('Permission to access location was denied');
         } else {
            setHasLocationPermissions(true);
           const statusBackground = await Location.requestBackgroundPermissionsAsync();
            if (statusBackground.status === 'granted') {
               await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                  accuracy:Location.Accuracy.High,
                  timeInterval: 10000,
                  distanceInterval: 80,
               });
               console.log("Permission granted for background");
            }else {
               console.log("Permission not granted for background");
             }
         }
         let locationW = await Location.watchPositionAsync({
            accuracy:Location.Accuracy.Highest,
            timeInterval: 10000,
            distanceInterval: 80,
            }
            ,(location_update) => {
               setLocationResult(JSON.stringify(location_update));
               setMapRegion( { latitude: location_update.coords.latitude, 
                  longitude: location_update.coords.longitude, 
                  latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA });
                  pushCoord(routeCoordinatesMap.concat({ latitude: location_update.coords.latitude, 
                     longitude: location_update.coords.longitude, 
                     latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA}));
               console.log("1");
               console.log(routeCoordinatesMap);
               console.log("2");
          });
          
        };

      useEffect(() => {
         _getLocationAsync() // start tracking
       }, [])

      const _handleMapRegionChange = mapRegion => {
         pushCoord(routeCoordinatesMap.concat(mapRegion));
         setMapRegion(mapRegion);
       };
     
      const calcDistance = newLatLng => {
         return haversine(prevLatLng, newLatLng) || 0;
       };
      
   return (
            <View style={styles.container}>
               <Text style={styles.paragraph}>
                  Pan, zoom, and tap on the map!
               </Text>
               {
                  locationResult === null ?
                  <Text>Finding your current location...</Text> :
                  hasLocationPermissions === false ?
                     <Text>Location permissions are not granted.</Text> :
                     mapRegion === null ?
                     <Text>Map region doesn't exist.</Text> :
                     <MapView
                     showsUserLocation={true}
                     zoomEnabled={true}
                     style={{ alignSelf: 'stretch', height: 400 }}
                     initialRegion={mapRegion}
                     onRegionChange={_handleMapRegionChange}
                     >
                        <Polyline
                           coordinates={routeCoordinatesMap} //specify our coordinates
                           strokeColor={"#000"}
                           strokeWidth={3}
                           lineDashPattern={[1]}
                           />
                        <Marker coordinate={mapRegion} />
                     </MapView>

               }
               <Text>
                  Location: {locationResult}
               </Text>
         </View>   
   );
}

 TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }) => { 
   
   if (error) {
     // check `error.message` for more details.
     return;
   }
   if( routeCoordinatesMap.length == 0){
      routeCoordinatesMap.push( { latitude: locations[0].coords.latitude, 
         longitude: locations[0].coords.longitude, 
         latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA });
   }
   routeCoordinatesMap.push({ latitude: locations[0].coords.latitude, 
      longitude: locations[0].coords.longitude, 
      latitudeDelta: LATITUDE_DELTA, longitudeDelta:LONGITUDE_DELTA });
   console.log('Received new locations', routeCoordinatesMap);
  });

const styles = StyleSheet.create({
   container: {
     flex: 1,
     alignItems: 'center',
     justifyContent: 'center',
     
     backgroundColor: '#ecf0f1',
   },
   paragraph: {
     margin: 24,
     fontSize: 18,
     fontWeight: 'bold',
     textAlign: 'center',
     color: '#34495e',
   },
 });