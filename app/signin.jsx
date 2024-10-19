import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { GlobalStyles } from './GlobalStyles';
import { useRouter } from "expo-router";

// Mock Firebase authentication function
const mockAuthSigninPassword = async (email, password) => {
    console.log(`Mock sign-in with Email: ${email}, Password: ${password}`);

    if (!email.includes('@')) {
        return { errorCode: 'auth/invalid-credential', errorMessage: 'Invalid email or password' };
    }
    if (password.length < 6) {
        return { errorCode: 'auth/invalid-credential', errorMessage: 'Password too short' };
    }
    return { uid: 'mockUserId', email }; // Simulate a successful sign-in
};

export default function SignIn() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorExists, setErrorExists] = useState(false);
    const [errorMessageUI, setErrorMessageUI] = useState('');
    
    const handleSignIn = async (email, password) => {
        try {
            const user = await mockAuthSigninPassword(email, password);
            if (user.errorCode) {
                console.log("Error:", user.errorCode, user.errorMessage);

                setErrorExists(true);
                switch (user.errorCode) {
                    case 'auth/invalid-credential':
                        setErrorMessageUI('These credentials don\'t match our records.');
                        break;
                    default:
                        setErrorMessageUI('Something went wrong');
                }
            } else {
                console.log("Signed in user:", user);
                router.navigate('/');
            }
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    const handleRedirectSignUp = async () => {
        router.navigate('/signup');
    }
      
    return (
        <View style={GlobalStyles.signInContainer}>
            <View style={GlobalStyles.signInInnerContainer}>
                <Text style={GlobalStyles.signInHeading}>Sign in to your account</Text>
            </View>

            <View style={GlobalStyles.signInInnerContainer}>
                <View style={GlobalStyles.signInForm}>
                    <View style={GlobalStyles.signInFormField}>
                        <Text style={GlobalStyles.signInLabel}>Email address</Text>
                        <TextInput
                            style={!errorExists ? GlobalStyles.signInInput : GlobalStyles.signInInputError}
                            placeholder="Email address"
                            inputMode="email-address"
                            autoCapitalize="none"
                            onChangeText={text => setEmail(text)}
                        />
                    </View>

                    <View style={GlobalStyles.signInFormField}> 
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={GlobalStyles.signInLabel}>Password</Text>
                            <Pressable>
                                <Text style={GlobalStyles.signInForgotPasswordLink}>Forgot password?</Text>
                            </Pressable>
                        </View>
                        <TextInput
                            style={!errorExists ? GlobalStyles.signInInput : GlobalStyles.signInInputError}
                            placeholder="Password"
                            secureTextEntry
                            autoCapitalize="none"
                            onChangeText={text => setPassword(text)}
                        />
                        <Text style={GlobalStyles.signInErrorMessage}>
                            {`${errorMessageUI}`}
                        </Text>
                    </View>

                    <Pressable style={GlobalStyles.signInSubmitButton} onPress={() => handleSignIn(email, password)}>
                        <Text style={{ color: '#FFFFFF' }}>Sign in</Text>
                    </Pressable>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                        <Text style={GlobalStyles.signInNoAccount}>Don't have an account? </Text>
                        <Pressable onPress={handleRedirectSignUp}>
                            <Text style={GlobalStyles.signInNoAccountLink}>Sign up</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}