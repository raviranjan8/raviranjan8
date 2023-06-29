import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_Key');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.log(e);
  }
}

export const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@user_Key', jsonValue)
  } catch (e) {
    console.log(e);
  }
}


export const updateToken = (token) => {
      const jsonValuePromise = AsyncStorage.getItem('@user_Key')
      jsonValuePromise.then(jsonValue => {
        	const user = (jsonValue != null ? JSON.parse(jsonValue) : null);
          user.accessToken = token;
          AsyncStorage.setItem("@user_Key", JSON.stringify(user));
      });
}

