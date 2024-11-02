import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { CurriculumItem } from '@/types/types'
import { isLoading } from 'expo-font';
import { FlatList, GestureHandlerRootView, Pressable } from 'react-native-gesture-handler';

interface CurriculumData {
    count: number;
    next: string | null;
    previous: string | null;
    results: CurriculumItem
}

interface CurriculumListProps {
    curriculumData: CurriculumData | undefined;
    isLoading: boolean;
    onLoadMore: () => void;
}

const CurriculumList: React.FC<CurriculumListProps> = ({
    curriculumData,
    isLoading,
    onLoadMore,
}) => {

    if (!curriculumData) {
        return <Text>No Curriculum Data Available</Text>
    }

    if (isLoading) {
        <View className='p-12' >
            <ActivityIndicator
                size="small"
                color="#0000ff"
            />
        </View>
    }

    const renderItem = ({ item }: { item: CurriculumItem }) => (
        <View className='p-2 mb-2'>
            {
                item._class === "chapter" ? (
                    <Text className='text-lg' style={{
                        fontFamily: "PoppinsBold"
                    }}>{item.title}</Text>

                ) : (
                    <View>
                        <Text className='text-md ml-4' style={{
                            fontFamily: "PoppinsSemiBold"
                        }}>{item.title}</Text>

                        {
                            item._class === "lecture" && (
                                <Text className='pl-4 text-blue-700' style={{
                                    fontFamily: "PoppinsSemiBold"
                                }}>{item.is_free ? "Free" : "Paid"}</Text>
                            )

                        }

                        {
                            item._class === "quiz" && (
                                <Text className='pl-4' style={{
                                    fontFamily: "PoppinsSemiBold"
                                }}>Quiz</Text>
                            )
                        }

                    </View>
                )
            }
        </View>
    );

    const renderFooter = () => {
        if (!isLoading) return null
        return (
            <View className='p-12'>
                <ActivityIndicator
                    size="small"
                    color="#0000ff"
                />
            </View>
        )
    }

    return (
        <View>
            <Text className='text-xl' style={{
                fontFamily: "PoppinsSemiBold"
            }}>Course Curriculum: {curriculumData.count} Items</Text>

            <GestureHandlerRootView>
                <FlatList
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    data={curriculumData.results}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListFooterComponent={renderFooter}
                />
            </GestureHandlerRootView>

            {curriculumData.next && !isLoading && (
                <Pressable
                    onPress={onLoadMore}
                    className='bg-blue-700 rounded-2xl py-4 items-center mt-12'
                >
                    <Text className='text-white text-lg' style={{
                        fontFamily: "PoppinsBold"
                    }}>
                        Load More Curriculum
                    </Text>
                </Pressable>

            )}

        </View >
    );
}

export default CurriculumList;