import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppLoading } from 'expo';
import { Poppins_400Regular, Poppins_500Medium, useFonts } from '@expo-google-fonts/poppins';

import Home from './src/pages/Home';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium
  });

  if (!fontsLoaded) {
    return (
      <AppLoading />
    );
  }

  return (
    <>
      <StatusBar style='dark' backgroundColor='#CCCCCC' />
      <Home />
    </>
  );
}
