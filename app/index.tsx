import { View, Text } from 'react-native'
import React, { useRef } from 'react'
import Animated, { FadeInDown, withDecay } from 'react-native-reanimated';
import Button from '@/components/Button';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';

export default function Welcome() {
const animation = useRef<LottieView>(null);

  return (
    <View className="bg-white flex-1 w-full justify-center items-center">

      <Animated.View className="w-full"
        entering={FadeInDown.duration(300).springify()}
      >

        <LottieView
        ref={animation}
        source={require("../assets/animations/learner.json")}
        autoPlay
        loop
        style={{width: "100%", height:400}}
        
        />
        
      </Animated.View>

      <Animated.View className="w-full mt-4"
        entering={FadeInDown.duration(300).delay(200).springify()}
      >

        <Text className="text-4xl text-center leading-[3.5rem]"
          style={{ fontFamily: "PoppinsExtraBold" }}
        > Discover and improve your skills</Text>
      </Animated.View>

      <Animated.View className="w-full mt-4"
        entering={FadeInDown.duration(300).delay(400).springify()}
      >

        <Text className="text-lg text-center leading-[2rem]"
          style={{ fontFamily: "PoppinsSemiBold" }}
        > Learn from the best courses & tutorials </Text>
      </Animated.View>

      {/*Button*/}

      <Animated.View className="w-full items-center mt-4"
        entering={FadeInDown.duration(300).delay(400).springify()}
      >

        <Button title='Get Started' action={() => router.push("/(tabs)")} />

      </Animated.View>


    </View>
  )
}
