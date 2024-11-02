import { ScrollView, Pressable, View, Text, Image, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { HelloWave } from '@/components/HelloWave'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import axios from 'axios'
import { password, username } from '@/utils/apikeys'
import { useQuery } from '@tanstack/react-query'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import CourseItem from '@/components/CourseItem'

interface Course {
  id: number;
  title: string;
  subtitle: string;
  image_480x270: string;
  is_paid: boolean;
  price: string;
  num_reviews: number
}

interface SearchResponse {
  results: Course[];

}

interface Category {
  id: string;
  name: string;
  icon: string;
}
const categories: Category[] = [
  { id: "business", name: "Business", icon: "briefcase" },
  { id: "tech", name: "Tech", icon: "hardware-chip" },
  { id: "design", name: "Design", icon: "color-palette" },
  { id: "marketing", name: "Marketing", icon: "megaphone" },
  { id: "health", name: "Health", icon: "fitness" },
  { id: "lifestyle", name: "Lifestyle", icon: "heart" },
];

const fetchCourses = async (searchTerm: string): Promise<SearchResponse> => {
  const response = await axios.get('https://www.udemy.com/api-2.0/courses/', {
    params: { search: searchTerm },
    auth: {
      username: username,
      password: password,
    },

  });
  return response.data;
}

const fetchRecommendedCourses = async (): Promise<SearchResponse> => {
  const response = await axios.get('https://www.udemy.com/api-2.0/courses/', {
    auth: {
      username: username,
      password: password,
    },

  });
  return response.data;
}




export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("business");

  const { data, error, isLoading } = useQuery({
    queryKey: ["searchCourses", selectedCategory],
    queryFn: () => fetchCourses(selectedCategory),
    enabled: true,

  });

  const { data: recommendedcourses, error: recommendedcourseserror, isLoading: recommendedcoursesloading } = useQuery({
    queryKey: ["recommendedcourses"],
    queryFn: () => fetchRecommendedCourses(),
    enabled: true,

  });

  // console.log("Data Result", data?.results);

  //Render Category
  const renderCategory = ({ item }: { item: Category }) => (
    <Pressable onPress={() => setSelectedCategory(item.id)}
      className='mr-4 p-2 rounded-full items-center flex-col gap-4'
    >
      <View
        className={`p-4 rounded-full flex-row items-center ${selectedCategory === item.id
          ? "border-2 border-blue-700"
          : "border border-gray-400"
          }`}
      >
        <Ionicons
          name={item.icon as any}
          size={24}
          color={selectedCategory === item.id ? "#1d4ed8" : "gray"} />

      </View>

      <Text style={{ fontFamily: selectedCategory === item.id ? "PoppinsBold" : "PoppinsRegular" }}>{item.name}</Text>
    </Pressable>
  )
  return (
    <View className="flex-1 bg-white">
      {/* Greetings */}
      <View className="pt-16 pb-6 px-6 bg-[#2563eb]">
        <Animated.View className="flex-row justify-between items-center">
          <View>

            <View className="flex-row items-end gap-2">
              <Text className="text-white text-lg"
                style={{ fontFamily: "PoppinsSemiBold" }}
              >
                Good Morning
              </Text>

              <View>
                <HelloWave />
              </View>

            </View>

            <Text className='text-white text-2xl'
              style={{ fontFamily: "PoppinsBold" }}
            >
              Jaswin Kumar
            </Text>
          </View>

          <View>
            <MaterialCommunityIcons
              name='bell-badge-outline'
              size={30}
              color="white"
            />
          </View>
        </Animated.View>

        {/* Search Area */}

        <Pressable onPress={() => router.push("/explore")}>
          <View className='flex-row items-center bg-white/20 rounded-2xl p-4 my-4'>
            <MaterialCommunityIcons name="magnify" size={20} color="white" />
            <Text className='text-white ml-2' style={{ fontFamily: "PoppinsRegular" }}>
              What do you want to learn?
            </Text>
          </View>

        </Pressable>

      </View>

      <ScrollView className="flex-1 bg-white gap-4">
        {/*Categories*/}
        <Animated.View
          entering={FadeInDown.duration(500).delay(200).springify()}
        >

          <View className='flex-row justify-between px-6 pt-4 items-center'>
            <Text className='text-xl'
              style={{ fontFamily: "PoppinsBold" }}
            >
              Explore Topics
            </Text>

            <Text className='text-blue-700'
              style={{ fontFamily: "PoppinsSemiBold" }}
            >
              See More
            </Text>

          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className='my-4 pl-4'>
            {/* Categories List */}

            {
              categories.map((category) => (
                <View key={category.id}>
                  {renderCategory({ item: category })}
                </View>

              ))
            }

          </ScrollView>

        </Animated.View>
        {/* Category Courses */}

        {
          isLoading ? (
            <View className='flex-1 justify-center items-center'>
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : error ? (
            <Text>Error: {(error as Error).message}</Text>
          ) : data?.results ? (
            <GestureHandlerRootView>
              <FlatList
                horizontal={true}
                data={data.results}

                renderItem={
                  ({ item }) => (
                    <CourseItem course={item} customStyle='w-[22rem] px-3' />

                  )
                }

                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
              />

            </GestureHandlerRootView>
          ) : (
            <View>
              <Text>No Results. Try searching for a different course.</Text>
            </View>
          )
        }

        {/* Recommended Courses */}
        <View className='pt-6'>
          <View className='flex-row justify-between px-6 py-4 items-center'>
            <Text className='text-xl'
              style={{ fontFamily: "PoppinsBold" }}
            >
             Recommended Courses 
            </Text>

            <Text className='text-blue-700'
              style={{ fontFamily: "PoppinsSemiBold" }}
            >
              See More
            </Text>

          </View>

          {
            recommendedcoursesloading ? (
              <View className='flex-1 justify-center items-center pt-8'>
                <ActivityIndicator size="large" color="#2563eb" />
              </View>
            ) : recommendedcourseserror ? (
              <Text>Error: {(recommendedcourseserror as Error).message}</Text>
            ) : recommendedcourses?.results ? (
              <GestureHandlerRootView>
                <FlatList
                  horizontal={true}
                  data={recommendedcourses?.results}

                  renderItem={
                    ({ item }) => (
                      <CourseItem course={item} customStyle='w-[22rem] px-3' />

                    )
                  }

                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                />

              </GestureHandlerRootView>
            ) : (
              <View>
                <Text>No Results. Try searching for a different course.</Text>
              </View>
            )
          }

        </View>

      </ScrollView>
    </View>
  )
}