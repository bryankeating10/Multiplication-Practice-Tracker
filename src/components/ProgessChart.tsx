import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Colors from '@/constants/colors';
import { PracticeAttempt } from '@/types/practice';

interface DataPoint {
	date: string;
	accuracy: number;
	speed: number;
	attempts: number;
}

interface ProgressChartProps {
	data: DataPoint[];
	title: string;
	metric: 'accuracy' | 'speed' | 'attempts';
}

export default function ProgressChart({
	data,
	title,
	metric
}: ProgressChartProps) {
	const chartWidth = Dimensions.get('window').width - 48;
	const chartHeight = 200;
	const paddingHorizontal = 20;
	const paddingVertical = 20;

	const graphWidth = chartWidth - (paddingHorizontal * 2);
	const graphHeight = chartHeight - (paddingVertical * 2);

	// Find max value for scaling
	const maxValue = Math.max(...data.map(d => d[metric]));

	// Calculate bar width based on number of data points
	const barWidth = graphWidth / data.length - 4;

	// Get label and color based on metric
	const getMetricLabel = () => {
		switch (metric) {
			case 'accuracy':
				return 'Accuracy (%)';
			case 'speed':
				return 'Avg. Speed (ms)';
			case 'attempts':
				return 'Number of Attempts';
		}
	};

	const getBarColor = () => {
		switch (metric) {
			case 'accuracy':
				return Colors.light.success;
			case 'speed':
				return Colors.light.primary;
			case 'attempts':
				return Colors.light.secondary;
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.subtitle}>{getMetricLabel()}</Text>

			<View style={styles.chartContainer}>
				{/* Y-axis labels */}
				<View style={styles.yAxis}>
					<Text style={styles.axisLabel}>{maxValue}</Text>
					<Text style={styles.axisLabel}>{Math.round(maxValue / 2)}</Text>
					<Text style={styles.axisLabel}>0</Text>
				</View>

				{/* Chart */}
				<View style={styles.chart}>
					{/* Horizontal grid lines */}
					<View style={[styles.gridLine, { top: 0 }]} />
					<View style={[styles.gridLine, { top: graphHeight / 2 }]} />
					<View style={[styles.gridLine, { top: graphHeight }]} />

					{/* Bars */}
					<View style={styles.barsContainer}>
						{data.map((point, index) => {
							const barHeight = (point[metric] / maxValue) * graphHeight;

							return (
								<View key={index} style={styles.barWrapper}>
									<View
										style={[
											styles.bar,
											{
												height: barHeight,
												width: barWidth,
												backgroundColor: getBarColor(),
											}
										]}
									/>
									<Text style={styles.barLabel}>{point.date}</Text>
								</View>
							);
						})}
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 32,
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 14,
		color: Colors.light.placeholder,
		marginBottom: 16,
	},
	chartContainer: {
		flexDirection: 'row',
		height: 200,
	},
	yAxis: {
		width: 40,
		height: '100%',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		paddingRight: 8,
		paddingVertical: 20,
	},
	axisLabel: {
		fontSize: 12,
		color: Colors.light.placeholder,
	},
	chart: {
		flex: 1,
		height: '100%',
		position: 'relative',
	},
	gridLine: {
		position: 'absolute',
		left: 0,
		right: 0,
		height: 1,
		backgroundColor: Colors.light.border,
	},
	barsContainer: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		height: '100%',
		paddingVertical: 20,
		justifyContent: 'space-around',
	},
	barWrapper: {
		alignItems: 'center',
	},
	bar: {
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
	},
	barLabel: {
		fontSize: 10,
		color: Colors.light.placeholder,
		marginTop: 4,
		transform: [{ rotate: '-45deg' }],
	},
});