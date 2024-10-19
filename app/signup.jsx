import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { GlobalStyles } from "./GlobalStyles";
import { useRouter } from "expo-router";

// Mock Firebase Functions
const mockAuthSignupPassword = async (email, password, username) => {
    console.log(`Mock sign-up: Email: ${email}, Password: ${password}, Username: ${username}`);
    if (!email.includes('@')) {
        return { errorCode: 'auth/invalid-email', errorMessage: 'Invalid email format' };
    }
    if (username.length < 3) {
        return { errorCode: 'auth/invalid-user-import', errorMessage: 'Invalid username' };
    }
    if (password.length < 6) {
        return { errorCode: 'auth/invalid-password', errorMessage: 'Password too short' };
    }
    // Mock successful user creation
    return { uid: 'mockUserId', email, username };
};

const mockSetDoc = async (docRef, data) => {
    console.log(`Mock set document: ${docRef} with data`, data);
    return Promise.resolve();
};

export default function SignUp() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const [emailErrorExists, setEmailErrorExists] = useState(false);
    const [userErrorExists, setUserErrorExists] = useState(false);
    const [passErrorExists, setPassErrorExists] = useState(false);
    const [errorMessageUI, setErrorMessageUI] = useState('');

    const handleSignUp = async (email, password, username) => {
        try {
            const user = await mockAuthSignupPassword(email, password, username);
            if (user.errorCode) {
                console.log("Error:", user.errorCode, user.errorMessage);

                switch (user.errorCode) {
                    case 'auth/invalid-email':
                        setEmailErrorExists(true);
                        setErrorMessageUI('Invalid email');
                        break;
                    case 'auth/invalid-user-import':
                        setUserErrorExists(true);
                        setErrorMessageUI('Invalid username');
                        break;
                    case 'auth/invalid-password':
                        setPassErrorExists(true);
                        setErrorMessageUI('Password too short');
                        break;
                    case 'auth/email-already-in-use':
                        setErrorMessageUI('Email is already in use');
                        break;
                    default:
                        setErrorMessageUI('Something went wrong');
                }
            } else {
                const avatarColors = ['cadetblue', 'coral', 'cornflowerblue', 'darksalmon', 'darkkhaki', 'deepskyblue'];
                let avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

                // Mock creating Firestore document for the user
                await mockSetDoc(`users/${user.uid}`, {
                    email: email,
                    username: username,
                    uid: user.uid,
                    exp: 0,
                    completedLevels: Array(35).fill(false),  // 35 levels initialized as false
                    ranking: null,
                    avatarColor: avatarColor,
                    timestamp: new Date().toISOString(),  // Mock timestamp
                });

                console.log('User document created for mock user:', user.uid);
                router.navigate('/');
            }
        } catch (error) {
            console.error("Sign-up failed:", error);
        }
    };

    return (
        <View style={GlobalStyles.signInContainer}>
            <View style={GlobalStyles.signInInnerContainer}>
                <Text style={GlobalStyles.signInHeading}>Create your account</Text>
            </View>

            <View style={GlobalStyles.signInInnerContainer}>
                <View style={GlobalStyles.signInForm}>
                    <View style={GlobalStyles.signInFormField}>
                        <Text style={GlobalStyles.signInLabel}>Email address</Text>
                        <TextInput
                            style={!emailErrorExists ? GlobalStyles.signInInput : GlobalStyles.signInInputError}
                            value={email}
                            placeholder="Email address"
                            inputMode="email-address"
                            autoCapitalize="none"
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>

                    <View style={GlobalStyles.signInFormField}>
                        <Text style={GlobalStyles.signInLabel}>Username</Text>
                        <TextInput
                            style={!userErrorExists ? GlobalStyles.signInInput : GlobalStyles.signInInputError}
                            value={username}
                            placeholder="Username"
                            inputMode="ascii-capable"
                            autoCapitalize="none"
                            onChangeText={(text) => setUsername(text)}
                        />
                    </View>

                    <View style={GlobalStyles.signInFormField}>
                        <Text style={GlobalStyles.signInLabel}>Password</Text>
                        <TextInput
                            style={!passErrorExists ? GlobalStyles.signInInput : GlobalStyles.signInInputError}
                            value={password}
                            placeholder="Password"
                            secureTextEntry
                            autoCapitalize="none"
                            onChangeText={(text) => setPassword(text)}
                        />
                    </View>

                    <Pressable
                        style={GlobalStyles.signInSubmitButton}
                        onPress={() => handleSignUp(email, password, username)}
                    >
                        <Text style={{ color: "#FFFFFF" }}>Sign Up</Text>
                    </Pressable>

                    {errorMessageUI ? <Text style={{ color: 'red' }}>{errorMessageUI}</Text> : null}
                </View>
            </View>
        </View>
    );
}