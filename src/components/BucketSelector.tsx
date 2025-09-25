import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { BucketOption } from '@/types/practice';

interface BucketSelectorProps {
	title: string;
	options: BucketOption[];
	onSelect: (option: BucketOption) => void;
	mode: 'include' | 'exclude';
}

export default function BucketSelector({ title, options, onSelect, mode }: BucketSelectorProps) {
	const isIncludeMode = mode === 'include';

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				{options.map((option) => (
					<TouchableOpacity
						key={option.id}
						style={[
							styles.option,
							option.isSelected && (isIncludeMode ? styles.selectedIncludeOption : styles.selectedExcludeOption)
						]}
						onPress={() => onSelect(option)}
					>
						<Text
							style={[
								styles.optionText,
								option.isSelected && styles.selectedOptionText
							]}
						>
							{option.label}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},
	title: {
		fontSize: 16,
		fontWeight: '500',
		color: Colors.light.text,
		marginBottom: 12,
	},
	scrollContent: {
		paddingRight: 16,
	},
	option: {
		backgroundColor: Colors.light.card,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 10,
		marginRight: 8,
		borderWidth: 1,
		borderColor: Colors.light.border,
	},
	selectedIncludeOption: {
		backgroundColor: Colors.light.primary,
		borderColor: Colors.light.primary,
	},
	selectedExcludeOption: {
		backgroundColor: Colors.light.error,
		borderColor: Colors.light.error,
	},
	optionText: {
		fontSize: 14,
		fontWeight: '500',
		color: Colors.light.text,
	},
	selectedOptionText: {
		color: 'white',
	},
});