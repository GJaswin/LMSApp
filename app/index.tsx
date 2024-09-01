import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import './global.css';


export default function App() {
  return (
  <View className="flex-1 items-center justify-center bg-white m-4 p-4">
      <Text>Open up App.js to start working on your app!</Text>
      <Text>Hello</Text>
      <StatusBar style="auto" />
    </View>
  );
}


