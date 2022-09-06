import 'react-native-gesture-handler';
import React from 'react';
import { CartProvider } from './components/CartContext';
import { RootNavigation } from './navigation/RootNavigation';

export default function App(props) {
 return (
  <CartProvider>
      <RootNavigation/>
  </CartProvider>
 );
}