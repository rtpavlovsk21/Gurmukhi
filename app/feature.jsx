import React, { useRef, useState } from "react";
import { Text, View, SafeAreaView, Pressable } from "react-native";
import { Canvas } from "@benjeau/react-native-draw";

import LessonButton from '../components/LessonButton.tsx'

// Mock design and coordinates data to simulate the letter designs and path coordinates
const mockCoordMap = {
	'ੳ': ["M10 10 L90 90"],  // Mocked SVG path
	'ਅ': ["M20 20 L80 80"],
	// Add more mock letters and paths here...
};

const mockSVGList = {
	'ੳ': () => (<Text>SVG: ੳ</Text>),  // Mock SVG components
	'ਅ': () => (<Text>SVG: ਅ</Text>),
	// Add more mock SVG components here...
};

// Mock Firebase Auth
const mockGetAuth = () => ({
	currentUser: { uid: "mockUserId" },
});

// Mock Firebase Firestore
const mockUpdateDoc = async (docRef, data) => {
	console.log(`Mock updating document: ${docRef} with data:`, data);
	return Promise.resolve();
};

const mockGetDoc = async (docRef) => {
	console.log(`Mock fetching document: ${docRef}`);
	return Promise.resolve({
		data: () => ({
			exp: 100,  // Example EXP value
			completedLevels: [
				{ 'ੳ': true }, { 'ਅ': false }, { 'ੲ': false }
				// More levels...
			]
		})
	});
};

// Refactor the main Feature component
export default function Feature() {
	const lessons = [{ letter: "ੳ" }, { letter: "ਅ" }]; // Mock lessons

	const svgList = mockSVGList; // Use mocked SVG components
	const coordMap = mockCoordMap; // Use mocked coordinate data

	const canvasRef = useRef(null);
	const [globalCounter, setGlobalCounter] = useState(0);
	const [ableToDraw, setAbleToDraw] = useState(true);
	const [completeButton, setCompleteButton] = useState(false);

	const handleGetPath = () => {
		const handwritingPathData = canvasRef.current?.getPaths();
		const currentStencilPath = coordMap[lessons[globalCounter].letter];

		// Simulate comparing the paths
		const similarity = Math.random(); // Mock similarity score
		console.log("Similarity:", similarity);

		if (similarity > 0.7) {
			handwritingPathData[globalCounter].color = "green";
			setGlobalCounter(globalCounter + 1);
		} else {
			handwritingPathData.pop();
			console.log("Path rejected, try again!");
		}

		canvasRef.current.clear();
		handwritingPathData.forEach((path) => {
			canvasRef.current.addPath(path);
		});
	};

	// Mock Firebase Auth and Firestore usage
	const auth = mockGetAuth();
	const currentUser = auth.currentUser;

	const handleCollectEXP = async () => {
		try {
			const docRef = `users/${currentUser.uid}`;
			const docSnap = await mockGetDoc(docRef);

			const currentData = docSnap.data();
			const currentEXP = currentData.exp || 0;
			const newEXP = currentEXP + 10;

			await mockUpdateDoc(docRef, { exp: newEXP });

			console.log(`Updated experience to ${newEXP}`);
		} catch (error) {
			console.log("Error collecting EXP:", error);
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<View style={{ zIndex: 2, position: "absolute" }}>
					{React.createElement(svgList[lessons[globalCounter].letter])}
				</View>

				<Pressable onPress={() => handleGetPath()}>
					<Canvas
						ref={canvasRef}
						height={100}
						width={100}
						style={{ backgroundColor: "transparent", zIndex: 3 }}
						enabled={ableToDraw}
					/>
				</Pressable>
			</View>

			{completeButton && (
				<LessonButton text="Collect 10 EXP" onPress={handleCollectEXP} />
			)}
		</SafeAreaView>
	);
}