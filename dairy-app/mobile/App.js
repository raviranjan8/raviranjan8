import 'react-native-gesture-handler';
import React from 'react';
import { CartProvider } from './components/CartContext';
import { RootNavigation } from './navigation/RootNavigation';
import { RecoilRoot } from 'recoil';

export default function App(props) {
 return (
  <RecoilRoot>
    <CartProvider>
        <RootNavigation/>
    </CartProvider>
  </RecoilRoot>
 );
}