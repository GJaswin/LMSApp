import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '@/types/types';
import { useWishlistStore } from '@/store/wishlistStore';

interface CourseItemProps {
    course: Course;
    customStyle?: string;
    index: number;
}

export default function CourseItem({ course, customStyle, index }: CourseItemProps) {
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
        <Pressable className={"p-4" + (customStyle ? customStyle : "")}>
            <Animated.View className="w-80 border-2 border-gray-300 overflow-hidden rounded-2xl"
                entering={FadeInDown.duration(100).delay(index * 300).springify()}
            >
                <Image
                    source={
                        {
                            uri: course.image_480x270,
                        }
                    }
                    className='w-full h-40'
                />

                <View className='px-4 p-2'>
                    <Text className='text-lg min-h-16'
                        style={{
                            fontFamily: "PoppinsBold",
                        }}
                    >{course.title}</Text>

                    <View className='flex-row items-center pt-2 pb-4 justify-between'>
                        <Text>{course.is_paid ? `${course.price}` : "Free"}</Text>
                        <Pressable onPress={toggleWishlist}>
                            <Ionicons color={ isWishlisted ? "red" : "gray" } name={ isWishlisted ? "heart" : "heart-outline" } size={24} />
                        </Pressable>
                    </View>

                </View>

            </Animated.View>
        </Pressable>
    )
}