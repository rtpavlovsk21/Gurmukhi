import { GlobalStyles } from "../GlobalStyles";
import React, { useState } from "react";
import {
	View,
	Text,
	SafeAreaView,
	ScrollView,
	TextInput,
	Pressable,
} from "react-native";
import { Avatar } from "@rneui/base";
import { useRouter } from "expo-router";

// Mock Firebase Services
const mockProfileData = {
	username: "testUser",
	email: "testuser@example.com",
	avatarColor: "blue",
};

const mockUpdateProfile = async (newEmail, newUsername) => {
	console.log(`Updated profile: ${newUsername} (${newEmail})`);
	return Promise.resolve();
};

const mockDeleteUser = async () => {
	console.log("User account deleted");
	return Promise.resolve();
};

export default function Profile() {
	const [username, setUsername] = useState(mockProfileData.username);
	const [email, setEmail] = useState(mockProfileData.email);
	const [verifiedPassword, setVerifiedPassword] = useState("");

	const [errorMessageUI, setErrorMessageUI] = useState("");
	const [errorExists_EmailUser, setErrorExists_EmailUser] = useState(false);
	const [errorExists_deleteAccount, setErrorExists_deleteAccount] = useState(false);
	const [errorMessageUI_deleteAccount, setErrorMessageUI_deleteAccount] = useState("");

	const router = useRouter();

	const handleUpdate_User_Email = async (newEmail, newUsername, verifiedPassword) => {
		try {
			// Simulate updating email and username
			await mockUpdateProfile(newEmail, newUsername);

			setVerifiedPassword("");
			setEmail("");
			setUsername("");
			setErrorExists_EmailUser(false);
			console.log("Profile updated successfully");
		} catch (error) {
			setErrorExists_EmailUser(true);
			setErrorMessageUI("Failed to update email or username.");
			console.error("Error updating email or username:", error);
		}
	};

	const handleDeleteAccount = async () => {
		try {
			// Simulate deleting user account
			await mockDeleteUser();
			setErrorExists_deleteAccount(false);
			console.log("User deleted");

			router.navigate('/signin');
		} catch (error) {
			setErrorExists_deleteAccount(true);
			setErrorMessageUI_deleteAccount("Failed to delete account.");
			console.error("Error deleting user or document:", error);
		}
	};

	return (
		<SafeAreaView style={{ height: "100%", backgroundColor: "#ffffff" }}>
			<ScrollView style={{ height: "100%" }}>
				<View style={GlobalStyles.profileContainer}>
					<View style={GlobalStyles.profileContent}>
						<View style={GlobalStyles.profileSection}>
							<Text style={GlobalStyles.profileSectionTitle}>Personal Information</Text>
							<Text style={GlobalStyles.profileSectionSubtitle}>Update your account details.</Text>

							<View style={GlobalStyles.profileForm}>
								<View style={GlobalStyles.profileFormGroup}>
									<Avatar
										rounded
										title={username.substring(0, 2)}
										size={48}
										containerStyle={{ backgroundColor: mockProfileData.avatarColor }}
									/>
									<Pressable style={GlobalStyles.profileButton}>
										<Text style={GlobalStyles.profileButtonText}>Change avatar color</Text>
									</Pressable>
								</View>

								<View style={GlobalStyles.profileInputGroup}>
									<Text style={GlobalStyles.profileLabel}>Username</Text>
									<TextInput
										style={!errorExists_EmailUser ? GlobalStyles.profileInput : GlobalStyles.profileInputError}
										placeholder="Username"
										placeholderTextColor="#B0B0B0"
										onChangeText={setUsername}
										value={username}
										autoComplete="username"
										autoCorrect={false}
										autoCapitalize="none"
									/>
								</View>

								<View style={GlobalStyles.profileInputGroup}>
									<Text style={GlobalStyles.profileLabel}>Email address</Text>
									<TextInput
										style={!errorExists_EmailUser ? GlobalStyles.profileInput : GlobalStyles.profileInputError}
										placeholder="Email address"
										placeholderTextColor="#B0B0B0"
										onChangeText={setEmail}
										value={email}
										autoComplete="email"
										autoCorrect={false}
										autoCapitalize="none"
									/>
								</View>

								<View style={GlobalStyles.profileInputGroup}>
									<Text style={GlobalStyles.profileLabel}>Verify password</Text>
									<TextInput
										style={!errorExists_EmailUser ? GlobalStyles.profileInput : GlobalStyles.profileInputError}
										placeholder="Verify password"
										placeholderTextColor="#B0B0B0"
										onChangeText={setVerifiedPassword}
										value={verifiedPassword}
										autoComplete="password"
										autoCorrect={false}
										autoCapitalize="none"
										secureTextEntry={true}
									/>
								</View>

								<View style={GlobalStyles.profileFormActions}>
									<Pressable
										style={GlobalStyles.profileSaveButton}
										onPress={() => handleUpdate_User_Email(email, username, verifiedPassword)}
									>
										<Text style={GlobalStyles.profileSaveButtonText}>Save</Text>
									</Pressable>
								</View>
							</View>
						</View>

						<View style={GlobalStyles.profileSection}>
							<Text style={GlobalStyles.profileSectionTitle}>Delete account</Text>
							<Text style={[GlobalStyles.profileSectionSubtitle, { marginBottom: 16 }]}>
								This action is not reversible. All information related to this account will be deleted permanently.
							</Text>

							<View style={GlobalStyles.profileFormActions}>
								<Pressable
									style={GlobalStyles.profileDeleteButton}
									onPress={handleDeleteAccount}
								>
									<Text style={GlobalStyles.profileSaveButtonText}>Yes, delete my account</Text>
								</Pressable>
							</View>

							{errorExists_deleteAccount === false && (
								<Text style={{ color: "green", fontSize: 18 }}>✅ Successfully deleted.</Text>
							)}
							{errorExists_deleteAccount === true && (
								<Text style={{ color: "red", fontSize: 18 }}>❌ {errorMessageUI_deleteAccount}</Text>
							)}
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}