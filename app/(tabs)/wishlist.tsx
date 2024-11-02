import { View, Text } from 'react-native'
import React from 'react'
import { useWishlistStore } from '@/store/wishlistStore'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import CourseItemTertiary from '@/components/CourseItemTertiary';

export default function Wishlist() {
    const { wishlist } = useWishlistStore();
    return (
        <GestureHandlerRootView>
            <View className='flex-1 items-center pt-12 bg-white'>
                <View className='p-4'>
                <Text className='text-xl mb-4'
                    style={{ fontFamily: "PoppinsBold" }}
                >
                    My Wishlist
                </Text>
                </View>
                {
                    wishlist.length === 0 ? (
                        <Text>Your Wishlist is Empty</Text>
                    ) : (
                        <FlatList data={wishlist} keyExtractor={(item) => item.id.toString()} renderItem={({ item, index }) => (
                            <CourseItemTertiary course={item} index={index} />

                        )}
                        />
                    )
                }

            </View>
        </GestureHandlerRootView>
    )
}