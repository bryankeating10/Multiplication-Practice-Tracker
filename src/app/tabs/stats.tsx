import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HeatMap from '@/components/HeatMap';
import ProgressChart from '@/components/ProgressChart';
import { usePracticeStore } from '@/store/practice-store';
import { StatsTimeRange } from '@/types/practice';
import Colors from '@/constants/colors';
import {
	generateAccuracyHeatMap,
	generateSpeedHeatMap,
	generateProgressData,
	getAccuracyColor,
	getSpeedColor,
	formatAccuracy,
	formatSpeed,
} from '@/utils/stats';

export default function StatsScreen() {
	const insets = useSafeAreaInsets();
	const { attempts } = usePracticeStore();

	// Time range options
	const timeRanges: StatsTimeRange[] = [
		{ label: 'Last 7 days', days: 7 },
		{ label: 'Last 30 days', days: 30 },
		{ label: 'All time', days: 365 },
	];

	const [selectedRange, setSelectedRange] = useState<StatsTimeRange>(timeRanges[0]);

	// Filter attempts by selected time range
	const filteredAttempts = useMemo(() => {
		const cutoffTime = Date.now() - (selectedRange.days * 24 * 60 * 60 * 1000);
		return attempts.filter(a => a.timestamp >= cutoffTime);
	}, [attempts, selectedRange.days]);

	// Generate heat map data
	const accuracyHeatMap = useMemo(() =>
		generateAccuracyHeatMap(filteredAttempts),
		[filteredAttempts]
	);

	const speedHeatMap = useMemo(() =>
		generateSpeedHeatMap(filteredAttempts),
		[filteredAttempts]
	);

	// Generate progress data
	const progressData = useMemo(() =>
		generateProgressData(attempts, 7), // Always show 7 days for progress
		[attempts]
	);

	// Calculate overall stats
	const totalAttempts = filteredAttempts.length;
	const correctAttempts = filteredAttempts.filter(a => a.isCorrect).length;
	const overallAccuracy = totalAttempts > 0
		? (correctAttempts / totalAttempts) * 100
		: 0;
	const averageTime = totalAttempts > 0
		? filteredAttempts.reduce((sum, a) => sum + a.timeMs, 0) / totalAttempts
		: 0;

	return (
		<View style={[styles.container, { paddingBottom: insets.bottom }]}>
			<Stack.Screen
				options={{
					title: 'Statistics',
					headerStyle: {
						backgroundColor: Colors.light.background,
					},
					headerTitleStyle: {
						color: Colors.light.text,
						fontWeight: '600',
					},
				}}
			/>

			<ScrollView style={styles.scrollView}>
				<View style={styles.header}>
					<Text style={styles.title}>Your Performance</Text>

					<View style={styles.timeRangeSelector}>
						{timeRanges.map(range => (
							<TouchableOpacity
								key={range.label}
								style={[
									styles.rangeOption,
									selectedRange.days === range.days && styles.selectedRange
								]}
								onPress={() => setSelectedRange(range)}
							>
								<Text
									style={[
										styles.rangeText,
										selectedRange.days === range.days && styles.selectedRangeText
									]}
								>
									{range.label}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>

				{totalAttempts > 0 ? (
					<>
						<View style={styles.statsCards}>
							<View style={styles.statsCard}>
								<Text style={styles.statsValue}>{totalAttempts}</Text>
								<Text style={styles.statsLabel}>Total Problems</Text>
							</View>

							<View style={styles.statsCard}>
								<Text style={styles.statsValue}>{Math.round(overallAccuracy)}%</Text>
								<Text style={styles.statsLabel}>Accuracy</Text>
							</View>

							<View style={styles.statsCard}>
								<Text style={styles.statsValue}>{Math.round(averageTime)}ms</Text>
								<Text style={styles.statsLabel}>Avg. Time</Text>
							</View>
						</View>

						<View style={styles.section}>
							<ProgressChart
								data={progressData}
								title="Accuracy Over Time"
								metric="accuracy"
							/>

							<ProgressChart
								data={progressData}
								title="Speed Over Time"
								metric="speed"
							/>

							<ProgressChart
								data={progressData}
								title="Problems Solved"
								metric="attempts"
							/>
						</View>

						<View style={styles.section}>
							<HeatMap
								data={accuracyHeatMap}
								title="Accuracy Heat Map"
								colorScale={getAccuracyColor}
								formatValue={formatAccuracy}
							/>

							<HeatMap
								data={speedHeatMap}
								title="Speed Heat Map (ms)"
								colorScale={getSpeedColor}
								formatValue={formatSpeed}
							/>
						</View>
					</>
				) : (
					<View style={styles.emptyState}>
						<Text style={styles.emptyStateTitle}>No data yet</Text>
						<Text style={styles.emptyStateText}>
							Start practicing multiplication to see your statistics here.
						</Text>
					</View>
				)}
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
	header: {
		padding: 16,
		paddingBottom: 8,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: Colors.light.text,
		marginBottom: 16,
	},
	timeRangeSelector: {
		flexDirection: 'row',
		marginBottom: 16,
	},
	rangeOption: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 16,
		marginRight: 8,
		backgroundColor: Colors.light.card,
	},
	selectedRange: {
		backgroundColor: Colors.light.primary,
	},
	rangeText: {
		fontSize: 14,
		color: Colors.light.text,
	},
	selectedRangeText: {
		color: 'white',
		fontWeight: '500',
	},
	statsCards: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 16,
	},
	statsCard: {
		flex: 1,
		backgroundColor: Colors.light.card,
		borderRadius: 12,
		padding: 16,
		marginHorizontal: 4,
		alignItems: 'center',
	},
	statsValue: {
		fontSize: 24,
		fontWeight: '700',
		color: Colors.light.primary,
		marginBottom: 4,
	},
	statsLabel: {
		fontSize: 14,
		color: Colors.light.placeholder,
	},
	section: {
		padding: 16,
	},
	emptyState: {
		padding: 32,
		alignItems: 'center',
		justifyContent: 'center',
	},
	emptyStateTitle: {
		fontSize: 20,
		fontWeight: '600',
		color: Colors.light.text,
		marginBottom: 8,
	},
	emptyStateText: {
		fontSize: 16,
		color: Colors.light.placeholder,
		textAlign: 'center',
	},
});