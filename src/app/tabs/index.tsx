import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';

import PracticeCard from '@/components/PracticeCard';
import NumberPad from '@/components/NumberPad';
import FeedbackMessage from '@/components/FeedbackMessage';
import BucketSelector from '@/components/BucketSelector';
import { usePracticeStore } from '@/store/practice-store';
import { BucketOption } from '@/types/practice';
import Colors from '@/constants/colors';

export default function PracticeScreen() {
	const insets = useSafeAreaInsets();
	const [answer, setAnswer] = useState('');
	const [feedback, setFeedback] = useState({
		visible: false,
		isCorrect: false,
		message: '',
	});
	const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

	const {
		currentProblem,
		settings,
		generateProblem,
		submitAnswer,
		updateSettings,
	} = usePracticeStore();

	// Generate include bucket options (with Random option)
	const includeBucketOptions: BucketOption[] = [
		{
			id: 'random',
			label: 'Random',
			value: null,
			isSelected: !settings.includedBuckets || settings.includedBuckets.length === 0,
		},
		...Array.from({ length: 19 }, (_, i) => i + 2).map(num => ({
			id: `include-${num}`,
			label: `${num}'s`,
			value: num,
			isSelected: (settings.includedBuckets || []).includes(num),
		}))
	];

	// Generate exclude bucket options
	const excludeBucketOptions: BucketOption[] = Array.from({ length: 19 }, (_, i) => i + 2).map(num => ({
		id: `exclude-${num}`,
		label: `${num}'s`,
		value: num,
		isSelected: (settings.excludedBuckets || []).includes(num),
	}));

	// Generate a problem when the component mounts or when we need a new one
	useEffect(() => {
		if (!currentProblem && !isProcessingAnswer) {
			generateProblem();
		}
	}, [currentProblem, generateProblem, isProcessingAnswer]);

	// Handle number press
	const handleNumberPress = (number: number) => {
		if (answer.length < 4 && !isProcessingAnswer) { // Limit to 4 digits and prevent input during processing
			setAnswer(prev => prev + number);
		}
	};

	// Handle delete
	const handleDelete = () => {
		if (!isProcessingAnswer) {
			setAnswer(prev => prev.slice(0, -1));
		}
	};

	// Handle submit
	const handleSubmit = () => {
		if (!answer || !currentProblem || isProcessingAnswer) return;

		setIsProcessingAnswer(true);

		const numAnswer = parseInt(answer, 10);
		const result = submitAnswer(numAnswer);

		if (result) {
			// Show feedback
			setFeedback({
				visible: true,
				isCorrect: result.isCorrect,
				message: result.isCorrect
					? 'Correct! Well done!'
					: `Incorrect. The answer is ${result.correctAnswer}.`,
			});

			// Clear answer immediately
			setAnswer('');

			// Haptic feedback
			if (Platform.OS !== 'web') {
				if (result.isCorrect) {
					Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
				} else {
					Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
				}
			}

			// Hide feedback and generate new problem after delay
			setTimeout(() => {
				setFeedback(prev => ({ ...prev, visible: false }));

				// Small additional delay to let feedback animation complete
				setTimeout(() => {
					setIsProcessingAnswer(false);
					// The useEffect will generate a new problem when isProcessingAnswer becomes false
				}, 300);
			}, 2000); // Increased to 2 seconds to give user more time to read feedback
		}
	};

	// Handle include bucket selection
	const handleIncludeBucketSelect = (option: BucketOption) => {
		if (isProcessingAnswer) return; // Prevent changes during processing

		if (option.value === null) {
			// Random option selected - clear all includes
			updateSettings({
				includedBuckets: [],
			});
		} else {
			// Specific bucket selected
			const currentIncluded = settings.includedBuckets || [];
			const isIncluded = currentIncluded.includes(option.value);
			let newIncludedBuckets: number[];

			if (isIncluded) {
				// Remove from inclusion
				newIncludedBuckets = currentIncluded.filter(b => b !== option.value);
			} else {
				// Add to inclusion
				newIncludedBuckets = [...currentIncluded, option.value];
			}

			updateSettings({
				includedBuckets: newIncludedBuckets,
			});
		}
	};

	// Handle exclude bucket selection
	const handleExcludeBucketSelect = (option: BucketOption) => {
		if (isProcessingAnswer) return; // Prevent changes during processing

		if (option.value !== null) {
			// Toggle bucket exclusion with safety check
			const currentExcluded = settings.excludedBuckets || [];
			const isExcluded = currentExcluded.includes(option.value);
			let newExcludedBuckets: number[];

			if (isExcluded) {
				// Remove from exclusion (include it)
				newExcludedBuckets = currentExcluded.filter(b => b !== option.value);
			} else {
				// Add to exclusion (exclude it)
				newExcludedBuckets = [...currentExcluded, option.value];
			}

			// Update settings
			updateSettings({
				excludedBuckets: newExcludedBuckets,
			});
		}
	};

	return (
		<View style={[styles.container, { paddingBottom: insets.bottom }]}>
			<Stack.Screen
				options={{
					title: 'Multiplication Table Practice',
					headerStyle: {
						backgroundColor: Colors.light.background,
					},
					headerTitleStyle: {
						color: Colors.light.text,
						fontWeight: '600',
					},
				}}
			/>

			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				<BucketSelector
					title="Include multiplication tables:"
					options={includeBucketOptions}
					onSelect={handleIncludeBucketSelect}
					mode="include"
				/>

				<BucketSelector
					title="Exclude multiplication tables:"
					options={excludeBucketOptions}
					onSelect={handleExcludeBucketSelect}
					mode="exclude"
				/>

				<FeedbackMessage
					isCorrect={feedback.isCorrect}
					message={feedback.message}
					visible={feedback.visible}
				/>

				{currentProblem && (
					<PracticeCard
						firstNumber={currentProblem.firstNumber}
						secondNumber={currentProblem.secondNumber}
					/>
				)}

				<NumberPad
					value={answer}
					onNumberPress={handleNumberPress}
					onDelete={handleDelete}
					onSubmit={handleSubmit}
					disabled={isProcessingAnswer}
				/>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		padding: 16,
	},
});