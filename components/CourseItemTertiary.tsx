import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '@/types/types';
import { useWishlistStore } from '@/store/wishlistStore';
import { router } from 'expo-router';

interface CourseItemTertiaryProps {
    course: Course;
    customStyle?: string;
    index: number;
}

export default function CourseItemTertiary({ course, customStyle, index }: CourseItemTertiaryProps) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    const isWishlisted = isInWishlist(course.id);

    const toggleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(course.id);
        } else {
            addToWishlist(course)
        }
    }

    return (
        <Pressable className={"p-4" + (customStyle ? customStyle : "")}
            onPress={() => router.push(
                {
                    pathname: "/coursedetail",
                    params: { courseId: course.id }
                }
            )}
        >
            <Animated.View className="gap-2 p-2 flex-row bg-white/90 w-full border border-gray-300 overflow-hidden rounded-2xl"
                entering={FadeInDown.duration(100).delay(index * 300).springify()}
            >
                <View className='w-1/4 h-20 rounded-full'>
                    <Image
                        source={
                            {
                                uri: course.image_480x270,
                            }
                        }
                        className='w-full h-20 rounded-2xl'
                    />
                </View>


                <View className='px-4 w-3/4'>
                    <Text className='text-base min-h-14'
                        style={{
                            fontFamily: "PoppinsBold",
                        }}
                    >{course.title}</Text>

                    <View className='flex-row items-center justify-between'>
                        <Text>{course.is_paid ? `${course.price}` : "Free"}</Text>
                        <Pressable onPress={toggleWishlist}>
                            <Ionicons color={isWishlisted ? "red" : "gray"} name={isWishlisted ? "heart" : "heart-outline"} size={24} />
                        </Pressable>
                    </View>

                </View>

            </Animated.View>
        </Pressable>
    )
}