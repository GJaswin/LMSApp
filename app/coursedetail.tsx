import { View, Text, Image, Pressable, ListRenderItem, ActivityIndicator } from 'react-native';
import axios from 'axios';
import React, { useState } from 'react';
import { Course, CurriculumItem, Review } from '@/types/types';
import { username, password } from '@/utils/apikeys';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import CurriculumList from '@/components/CurriculumList';

const fetchCourseDetails = async (courseId: string): Promise<Course> => {
    const response = await axios.get<Course>(`https://www.udemy.com/api-2.0/courses/${courseId}`, {
        auth: {
            username: username,
            password: password,
        },
    }
    );
    return response.data;

};

const fetchCourseCurriculum = async (courseId: string, page: number = 1): Promise<CurriculumItem> => {
    const response = await axios.get<CurriculumItem>(`https://www.udemy.com/api-2.0/courses/${courseId}/public-curriculum-items/?page=${page}`, {
        auth: {
            username: username,
            password: password,
        },
    }
    );
    return response.data;

};

const fetchCourseReviews = async (courseId: string, page: number = 1): Promise<Course> => {
    const response = await axios.get<Course>(`https://www.udemy.com/api-2.0/courses/${courseId}/reviews`, {
        auth: {
            username: username,
            password: password,
        },
    }
    );
    return response.data;

};

const SegmentedControl: React.FC<{
    selectedSegment: "curriculum" | "reviews";
    onSegmentChange: (segment: "curriculum" | "reviews") => void
}> = ({ selectedSegment, onSegmentChange }) => (
    <View className='flex-row mb-4 bg-gray-200 rounded-lg p-1 mt-6'>

        <Pressable
            onPress={() => onSegmentChange("curriculum")}
            className={`flex-1 py-3 rounded-md ${selectedSegment === "curriculum" ? "bg-blue-700" : "bg-transparent"
                }`}>

            <Text
                className={`text-center ${selectedSegment === "curriculum" ? "text-white" : "text-gray-700"
                    }`}
                style={{
                    fontFamily: selectedSegment === "curriculum" ? "PoppinsBold" : "PoppinsSemiBold"
                }}
            >
                Curriculum
            </Text>

        </Pressable>

        {/*Reviews*/}

        <Pressable
            onPress={() => onSegmentChange("reviews")}
            className={`flex-1 py-3 rounded-md ${selectedSegment === "reviews" ? "bg-blue-700" : "bg-transparent"
                }`}>

            <Text
                className={`text-center ${selectedSegment === "reviews" ? "text-white" : "text-gray-700"
                    }`}
                style={{
                    fontFamily: selectedSegment === "reviews" ? "PoppinsBold" : "PoppinsSemiBold"
                }}
            >
                Reviews
            </Text>

        </Pressable>

    </View>

);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <View className='flex-row'>
            {
                [1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name={star <= rating ? "star" : "star-outline"}
                        size={16}
                        color={star <= rating ? "#a16207" : "#d3d3d3"}
                    />

                ))}

        </View>
    )
}


export default function coursedetail() {

    const { courseId } = useLocalSearchParams<{ courseId: string }>();
    const [selectedSegment, setSelectedSegment] = useState<"curriculum" | "reviews">("curriculum");
    const [curriculumPage, setCurriculumPage] = useState(1);
    const queryClient = useQueryClient();


    // Course Details
    const { data, error, isLoading, refetch } = useQuery<Course>({
        queryKey: ["courseId", courseId],
        queryFn: () => fetchCourseDetails(courseId || ""),
        enabled: true,

    });

    //Curriculum Data
    const { data: curriculumData, error: curriculumError, isLoading: curriculumIsLoading, isFetching: curriculumFetching } = useQuery<Course>({
        queryKey: ["coursecurriculum", courseId, curriculumPage],
        queryFn: () => fetchCourseCurriculum(courseId || ""),
        enabled: !!courseId,
        keepPreviousData: true

    });

    // Reviews
    const { data: reviewsData, error: reviewsError, isLoading: reviewsIsLoading } = useQuery({
        queryKey: ["coursereviews", courseId],
        queryFn: () => fetchCourseReviews(courseId || ""),
        enabled: !!courseId,

    });

    const loadMoreCurriculum = () => {
        if (curriculumData?.next) {
            setCurriculumPage((prev) => prev + 1)
        }
    };

    const mergedCurriculumData = React.useMemo(() => {
        if (!curriculumData) return undefined;

        const prevData = queryClient.getQueryData<typeof curriculumData>([
            "courseCurriculum",
            courseId,
            curriculumPage - 1,
        ]);

        return {
            ...curriculumData,
            results: [...(prevData?.results || []), ...curriculumData.results],
        };

    }, [curriculumData, curriculumPage, courseId, queryClient]

    );

    if (isLoading || (curriculumIsLoading && curriculumPage === 1)) {
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator
                    color={"#000"}
                    size="large"
                />
            </View>
        )
    }

    if (error || curriculumError) {
        return (
            <View className='flex-1 justify-center items-center'>
                <Text>
                    Error: {((error || curriculumError) as Error).message}
                </Text>
            </View>
        )
    }

    if (!data) {
        return (
            <View className='flex-1 justify-center items-center'>
                <Text className='text-xl'
                    style={{ fontFamily: "PoppinsBold" }}
                >
                    No Data Available
                </Text>
            </View>
        )
    }



    const renderReviewsItem: ListRenderItem<Review> = ({ item }) => (
        <View key={item.id} className='mb-4 border-t border-neutral-300 rounded-lg'>
            <View className='flex-row justify-between items-center mb-2'>
                <Text className='text-lg font-bold'>{item.user?.display_name}</Text>

                <StarRating rating={item.rating} />
            </View>
            <Text className='text-gray-500 text-sm'
                style={{
                    fontFamily: "PoppinsRegular"
                }}
            >
                {new Date(item.created).toLocaleDateString()}

            </Text>
            {
                item.content ? (
                    <Text className='text-gray-600 mt-2 capitalize'
                        style={{ fontFamily: "PoppinsRegular" }}
                    >
                        {item.content}
                    </Text>
                ) : (
                    <Text className='text-gray-600 mt-2 capitalize'
                        style={{ fontFamily: "PoppinsRegular" }}
                    >
                        No Comments Provided
                    </Text>

                )
            }


        </View>
    )

    return (
        <GestureHandlerRootView>
            <ParallaxScrollView
                headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
                headerImage={
                    <Image
                        source={{
                            uri: data?.image_480x270,
                        }}
                        className='w-full h-72 rounded-lg'

                    />

                }
            >
                <View>
                    <View className='bg-blue-700 rounded-xl p-0.5 mb-4 w-32 justify-center items-center'>
                        <Text className='text-base text-white'
                            style={{
                                fontFamily: "PoppinsRegular"
                            }}
                        >
                            {data?.locale.title}
                        </Text>
                    </View>
                    <Text className='text-xl' style={{
                        fontFamily: "PoppinsBold"
                    }}>
                        {data?.title}
                    </Text>

                    <View>
                        <Text className='text-base text-gray-700'
                            style={{
                                fontFamily: "PoppinsSemiBold"
                            }}
                        >
                            {data?.visible_instructors[0]?.display_name}
                        </Text>


                    </View>
                    <Text className='text-2xl mt-6'
                        style={{
                            fontFamily: "PoppinsBold"
                        }}
                    >
                        {data?.is_paid ? data?.price : "Free"}
                    </Text>

                    <SegmentedControl
                        selectedSegment={selectedSegment}
                        onSegmentChange={setSelectedSegment}
                    />

                    {
                        selectedSegment === "reviews" ? (
                            <>
                                <Text className='text-xl pb-4' style={{
                                    fontFamily: "PoppinsBold"
                                }}>Reviews {reviewsData?.count}</Text>

                                <FlatList
                                    nestedScrollEnabled={true}
                                    scrollEnabled={false}
                                    data={reviewsData?.results}
                                    renderItem={renderReviewsItem}
                                    keyExtractor={(item) => item.id.toString()}
                                />
                            </>

                        ) : (
                            <>

                                <CurriculumList
                                    curriculumData={mergedCurriculumData}
                                    isLoading={curriculumIsLoading}
                                    onLoadMore={loadMoreCurriculum}
                                />
                            </>

                        )
                    }


                </View>
            </ParallaxScrollView>
        </GestureHandlerRootView>
    )
}