import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '@/constants/colors';
import { HeatMapData } from '@/types/practice';

interface HeatMapProps {
	data: HeatMapData[];
	title: string;
	colorScale: (value: number) => string;
	formatValue: (value: number) => string;
	emptyValue?: string;
}

export default function HeatMap({
	data,
	title,
	colorScale,
	formatValue,
	emptyValue = '-'
}: HeatMapProps) {
	// Create a 2D grid from the data
	const grid: (HeatMapData | null)[][] = Array(19)
		.fill(null)
		.map(() => Array(19).fill(null));

	// Fill the grid with data
	data.forEach(item => {
		const rowIndex = item.x - 2; // Adjust for 0-indexing and starting at 2
		const colIndex = item.y - 2; // Adjust for 0-indexing and starting at 2

		if (rowIndex >= 0 && rowIndex < 19 && colIndex >= 0 && colIndex < 19) {
			grid[rowIndex][colIndex] = item;
		}
	});

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>

			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<View style={styles.heatmapContainer}>
					{/* Column headers */}
					<View style={styles.headerRow}>
						<View style={styles.cornerCell} />
						{Array.from({ length: 19 }, (_, i) => i + 2).map(num => (
							<View key={`col-${num}`} style={styles.headerCell}>
								<Text style={styles.headerText}>{num}</Text>
							</View>
						))}
					</View>

					{/* Rows */}
					{grid.map((row, rowIndex) => (
						<View key={`row-${rowIndex}`} style={styles.row}>
							{/* Row header */}
							<View style={styles.headerCell}>
								<Text style={styles.headerText}>{rowIndex + 2}</Text>
							</View>

							{/* Cells */}
							{row.map((cell, colIndex) => {
								const value = cell ? cell.value : null;
								const backgroundColor = value !== null ? colorScale(value) : Colors.light.card;

								return (
									<View
										key={`cell-${rowIndex}-${colIndex}`}
										style={[styles.cell, { backgroundColor }]}
									>
										<Text style={styles.cellText}>
											{value !== null ? formatValue(value) : emptyValue}
										</Text>
									</View>
								);
							})}
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 24,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 16,
	},
	heatmapContainer: {
		borderRadius: 8,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: Colors.light.border,
	},
	headerRow: {
		flexDirection: 'row',
		backgroundColor: Colors.light.card,
	},
	cornerCell: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.light.primary + '20',
	},
	headerCell: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.light.primary + '20',
	},
	headerText: {
		fontSize: 14,
		fontWeight: '600',
		color: Colors.light.text,
	},
	row: {
		flexDirection: 'row',
	},
	cell: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cellText: {
		fontSize: 12,
		fontWeight: '500',
		color: Colors.light.text,
	},
});