import Cards from "../Cards";
import "./style.css";
import { SafeAreaView, View, Text, Pressable, ScrollView } from "react-native";
import { useState, useEffect } from 'react';
import { GlobalStyles } from '../GlobalStyles'

import { useRouter } from "expo-router";

// Mock Firebase Authentication and Firestore for testing
const mockAuth = {
  currentUser: {
    uid: 'mockUserId',
    email: 'testuser@example.com',
  }
};

const mockDb = {
  users: {
    "mockUserId": {
      completedLevels: [
        { level1: true },
        { level2: false },
        { level3: true },
        // Add more mock levels here for testing
      ],
      ranking: 12,
      exp: 2000
    }
  }
};

const mockGetDoc = async (docRef) => {
  const userId = docRef.split("/").pop();
  return {
    exists: () => true,
    data: () => mockDb.users[userId],
  };
};

export default function Index() {
  const handleContinue = () => {
    console.log('Continue button pressed');
  }
  const router = useRouter();

  // Use mockAuth instead of actual Firebase auth
  const auth = mockAuth;
  const currentUser = auth.currentUser;

  const [statsMain, setStatsMain] = useState();
  const [stats, setStats] = useState([]);

  const handleNavFromStats = (route) => {
    if (route === 'leaderboard') {
      router.navigate('/leaderboard');
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Using mockGetDoc instead of Firebase Firestore getDoc
        const docSnap = await mockGetDoc(`users/${currentUser.uid}`);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setStatsMain(data);
          console.log("statsMainData: ", data);

          const completedLevels = (completedLevels_DB) => {
            const filteredLevels = completedLevels_DB.filter((obj) =>
              Object.values(obj).some(value => value === true)
            );
            return filteredLevels.length;
          };

          const completedLevels_String = `${completedLevels(data.completedLevels)} / 35`;
          console.log("Mock completed levels:", completedLevels(data.completedLevels));

          setStats([
            { name: 'Lessons completed', stat: completedLevels_String, cta: '' },
            { name: 'Leaderboard standing', stat: data.ranking, cta: 'View leaderboard' },
            { name: 'Experience level', stat: data.exp, cta: '' },
          ]);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <ScrollView>
      <SafeAreaView style={{ paddingHorizontal: 20, paddingVertical: 20, width: '100%' }}>
        <View>
          <Text style={GlobalStyles.statsTextBase}>Your stats</Text>
          <View style={GlobalStyles.statsGridContainer}>
            {stats.map((item) => (
              <View key={item.name} style={GlobalStyles.statsCard}>
                <View style={GlobalStyles.statsCardUpperHalf}>
                  <Text style={GlobalStyles.statsCardTitle}>{item.name}</Text>
                  {item.stat == undefined ? (
                    <Text style={GlobalStyles.statsCardStat}>Check back later!</Text>
                  ) : (
                    <Text style={GlobalStyles.statsCardStat}>{item.stat}</Text>
                  )}
                </View>
                {item.name === 'Percentage completed' || item.stat == undefined ? null : (
                  <View style={GlobalStyles.statsLinkContainer}>
                    <Pressable onPress={() => handleNavFromStats('leaderboard')}>
                      <Text style={GlobalStyles.statsLinkText}>
                        {`${item.cta}`}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={GlobalStyles.lessonsBgLight}>
          <View style={GlobalStyles.lessonsContainer}>
            <View style={GlobalStyles.lessonsHeader}>
              <Text style={GlobalStyles.lessonTitle}>Your lessons</Text>
            </View>
          </View>
        </View>
        <Cards />
      </SafeAreaView>
    </ScrollView>
  );
}