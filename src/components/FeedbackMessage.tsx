import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '@/constants/colors';

interface FeedbackMessageProps {
	isCorrect: boolean;
	message: string;
	visible: boolean;
}

export default function FeedbackMessage({
	isCorrect,
	message,
	visible
}: FeedbackMessageProps) {
	const fadeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	}, [visible, fadeAnim]);

	if (!visible) return null;

	return (
		<Animated.View
			style={[
				styles.container,
				isCorrect ? styles.correctContainer : styles.incorrectContainer,
				{ opacity: fadeAnim }
			]}
		>
			<Text style={styles.message}>{message}</Text>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		marginBottom: 16,
		alignItems: 'center',
	},
	correctContainer: {
		backgroundColor: Colors.light.success + '20', // 20% opacity
		borderWidth: 1,
		borderColor: Colors.light.success,
	},
	incorrectContainer: {
		backgroundColor: Colors.light.error + '20', // 20% opacity
		borderWidth: 1,
		borderColor: Colors.light.error,
	},
	message: {
		fontSize: 16,
		fontWeight: '500',
		color: Colors.light.text,
	},
});