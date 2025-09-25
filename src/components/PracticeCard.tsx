import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '@/constants/colors';
import { PracticeAttempt } from '@/types/practice';

interface PracticeCardProps {
	firstNumber: number;
	secondNumber: number;
	onComplete?: (attempt: PracticeAttempt) => void;
}

export default function PracticeCard({
	firstNumber,
	secondNumber,
}: PracticeCardProps) {
	const fadeAnim = useState(new Animated.Value(0))[0];

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();

		return () => {
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start();
		};
	}, [firstNumber, secondNumber]);

	return (
		<Animated.View
			style={[
				styles.container,
				{ opacity: fadeAnim }
			]}
		>
			<View style={styles.problem}>
				<Text style={styles.number}>{firstNumber}</Text>
				<Text style={styles.operator}>×</Text>
				<Text style={styles.number}>{secondNumber}</Text>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.light.card,
		borderRadius: 16,
		padding: 20,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 2,
		marginBottom: 20,
	},
	problem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	number: {
		fontSize: 42,
		fontWeight: '600',
		color: Colors.light.text,
		marginHorizontal: 8,
	},
	operator: {
		fontSize: 32,
		color: Colors.light.primary,
		marginHorizontal: 8,
	},
});