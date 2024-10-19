import { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView } from "react-native";
import { GlobalStyles } from "../GlobalStyles";
import { Avatar } from '@rneui/base';

// Mock Firebase Firestore for Testing
const mockUsersData = [
    { uid: '1', username: 'Alice', exp: 500, avatarColor: 'blue', ranking: 0 },
    { uid: '2', username: 'Bob', exp: 800, avatarColor: 'green', ranking: 0 },
    { uid: '3', username: 'Charlie', exp: 1200, avatarColor: 'red', ranking: 0 }
];

const mockUpdateDoc = async (docRef, data) => {
    console.log(`Updating user ${docRef} with data:`, data);
    return Promise.resolve();
};

export default function Leaderboard() {
    const [usersDataLB, setUsersDataLB] = useState([]);
    const [topThreeData, setTopThreeData] = useState([]);

    const updateUserRankings = async (data) => {
        const sortedData = data.sort((a, b) => b.exp - a.exp);

        const topThree = sortedData.slice(0, 3);
        const topThreeIds = topThree.map((user, index) => {
            mockUpdateDoc(`users/${user.uid}`, {
                ranking: index + 1
            });
            return user.uid;
        });

        setTopThreeData(topThreeIds);

        sortedData.forEach((user, index) => {
            if (!topThreeIds.includes(user.uid)) {
                mockUpdateDoc(`users/${user.uid}`, {
                    ranking: index + 1
                });
            }
        });

        setUsersDataLB(sortedData);
    };

    const getAllUsersLB = async () => {
        console.log("Fetching all users from mock data...");
        // Use mockUsersData for testing
        updateUserRankings(mockUsersData);
    };

    useEffect(() => {
        getAllUsersLB();
    }, []);

    return (
        <SafeAreaView style={{ height: '100%' }}>
            <FlatList
                data={usersDataLB.sort((a, b) => b.exp - a.exp)}
                keyExtractor={(item) => item.uid.toString()}
                renderItem={({ item }) => (
                    <View style={GlobalStyles.leaderboardListItem}>
                        <View style={GlobalStyles.avatarContainer}>
                            <Avatar
                                rounded
                                title={item.username.substring(0, 2)}
                                size={48}
                                containerStyle={{ backgroundColor: item.avatarColor }}
                            />
                            {item.ranking === 1 ? (
                                <View style={GlobalStyles.avatarBadgeGold}>
                                    <Text style={GlobalStyles.leaderboardTop3Number}>🥇</Text>
                                </View>
                            ) : item.ranking === 2 ? (
                                <View style={GlobalStyles.avatarBadgeSilver}>
                                    <Text style={GlobalStyles.leaderboardTop3Number}>🥈</Text>
                                </View>
                            ) : item.ranking === 3 ? (
                                <View style={GlobalStyles.avatarBadgeBronze}>
                                    <Text style={GlobalStyles.leaderboardTop3Number}>🥉</Text>
                                </View>
                            ) : null}
                        </View>

                        <Text style={{ paddingLeft: 18, marginRight: 'auto', alignSelf: 'center' }}>
                            {`${item.username}`}
                        </Text>
                        <Text style={{ alignSelf: 'center' }}>{`${item.exp} XP`}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}