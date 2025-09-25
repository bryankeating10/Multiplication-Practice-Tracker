import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface NumberPadProps {
	onNumberPress: (number: number) => void;
	onDelete: () => void;
	onSubmit: () => void;
	value: string;
	disabled?: boolean;
}

export default function NumberPad({
	onNumberPress,
	onDelete,
	onSubmit,
	value,
	disabled = false,
}: NumberPadProps) {
	const handlePress = (number: number) => {
		if (disabled) return;

		if (Platform.OS !== 'web') {
			Haptics.selectionAsync();
		}
		onNumberPress(number);
	};

	const handleDelete = () => {
		if (disabled) return;

		if (Platform.OS !== 'web') {
			Haptics.selectionAsync();
		}
		onDelete();
	};

	const handleSubmit = () => {
		if (disabled || !value) return;

		if (Platform.OS !== 'web') {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		}
		onSubmit();
	};

	const isSubmitDisabled = disabled || !value;

	return (
		<View style={styles.container}>
			<View style={styles.display}>
				<Text style={[styles.displayText, disabled && styles.disabledText]}>
					{value || '0'}
				</Text>
			</View>

			<View style={styles.grid}>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
					<TouchableOpacity
						key={num}
						style={[styles.button, disabled && styles.disabledButton]}
						onPress={() => handlePress(num)}
						disabled={disabled}
					>
						<Text style={[styles.buttonText, disabled && styles.disabledText]}>
							{num}
						</Text>
					</TouchableOpacity>
				))}

				<TouchableOpacity
					style={[styles.button, disabled && styles.disabledButton]}
					onPress={handleDelete}
					disabled={disabled}
				>
					<X size={20} color={disabled ? Colors.light.placeholder : Colors.light.text} />
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.button, disabled && styles.disabledButton]}
					onPress={() => handlePress(0)}
					disabled={disabled}
				>
					<Text style={[styles.buttonText, disabled && styles.disabledText]}>0</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.button,
						styles.submitButton,
						isSubmitDisabled && styles.disabledSubmitButton
					]}
					onPress={handleSubmit}
					disabled={isSubmitDisabled}
				>
					<Text style={[
						styles.buttonText,
						styles.submitText,
						isSubmitDisabled && styles.disabledSubmitText
					]}>
						Enter
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	display: {
		backgroundColor: Colors.light.inputBackground,
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
		alignItems: 'flex-end',
	},
	displayText: {
		fontSize: 28,
		fontWeight: '600',
		color: Colors.light.text,
	},
	disabledText: {
		color: Colors.light.placeholder,
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	button: {
		width: '30%',
		aspectRatio: 1.2,
		backgroundColor: Colors.light.card,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 8,
	},
	disabledButton: {
		backgroundColor: Colors.light.inputBackground,
	},
	buttonText: {
		fontSize: 20,
		fontWeight: '500',
		color: Colors.light.text,
	},
	submitButton: {
		backgroundColor: Colors.light.primary,
	},
	disabledSubmitButton: {
		backgroundColor: Colors.light.border,
	},
	submitText: {
		color: 'white',
		fontSize: 16,
	},
	disabledSubmitText: {
		color: Colors.light.placeholder,
	},
});