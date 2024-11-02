import { View, Text, Pressable, TextInput, ActivityIndicator, FlatList } from 'react-native';
import React, { useState } from 'react';
import { username, password } from '@/utils/apikeys';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import CourseItem from '@/components/CourseItem';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface SearchResponse {
  results: ArrayLike<any> | null | undefined;

}

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

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");


  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["searchCourses", searchQuery],
    queryFn: () => fetchCourses(searchQuery),
    enabled: true,

  });

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    refetch();
  }

  return (
    <GestureHandlerRootView>
      <View className='flex-1 pt-12 bg-white justify-center items-center'>
        <View className='p-4 items-center'>
          <View className='flex-row mb-2 w-full border-2 border-neutral-400 rounded-2xl overflow-hidden bg-white'>
            <TextInput className='p-2 w-3/4' placeholder='Search for Courses' placeholderTextColor="gray"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <Pressable className='bg-blue-700 w-1/4 p-4 justify-center items-center' onPress={handleSearch}>
              <Text className='text-white' style={{ fontFamily: "PoppinsBold" }}>Search</Text>
            </Pressable>

          </View>
          {
            isLoading ? (
              <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size="large" color="#2563eb" />
              </View>
            ) : error ? (
              <Text>Error: {(error as Error).message}</Text>
            ) : data?.results ? (
              <FlatList
                data={data.results}

                renderItem={
                  ({ item, index }) => (
                    <CourseItem course={item} index={index} />

                  )
                }

                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
              />

            ) : (
              <View>
                <Text>No Results. Try searching for a different course.</Text>
              </View>
            )
          }
        </View>



    </View >
    </GestureHandlerRootView>

  );

}