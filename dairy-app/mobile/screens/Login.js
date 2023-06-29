import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

import AuthService from "../services/auth.service";
import { CartContext } from '../components/CartContext';
 
export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const {user, setUser} = useContext(CartContext);

  useEffect( () => {
    setMessage("");
   },  [props]);
 
  const login = () => {
    var loginParam = {
      username : username,
      password : password
    };
    AuthService.login(loginParam).then(
      (response) => {
        setMessage("");
        setUser(response);
        props.navigation.navigate("Products");
      },
      (error) => {
        const resMessage =  (error.response &&  error.response.data &&  error.response.data.message) 
                                      || error.message ||  error.toString();
        setMessage(resMessage);
      }
    );
  }


  return (
    <View style={styles.container}> 
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Please enter mobile."
          placeholderTextColor="#003f5c"
          onChangeText={(username) => setUsername(username)}
          keyboardType="numeric"
        />
      </View>
 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Please enter otp."
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          keyboardType="numeric"
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <Text>{message}</Text>
      
      <TouchableOpacity style={styles.loginBtn} onPress={login}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
 
  image: {
    marginBottom: 40,
  },
 
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
 
    alignItems: "center",
  },
 
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
 
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
 
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
   
    backgroundColor: 'rgba(199, 43, 98, 1)',
  },
});