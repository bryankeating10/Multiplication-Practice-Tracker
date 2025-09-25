import { PracticeAttempt, HeatMapData } from '@/types/practice';

// Group attempts by date
export function groupAttemptsByDate(attempts: PracticeAttempt[]) {
	const grouped = attempts.reduce((acc, attempt) => {
		const date = new Date(attempt.timestamp).toLocaleDateString();

		if (!acc[date]) {
			acc[date] = [];
		}

		acc[date].push(attempt);
		return acc;
	}, {} as Record<string, PracticeAttempt[]>);

	return grouped;
}

// Calculate accuracy for a set of attempts
export function calculateAccuracy(attempts: PracticeAttempt[]) {
	if (attempts.length === 0) return 0;

	const correctCount = attempts.filter(a => a.isCorrect).length;
	return (correctCount / attempts.length) * 100;
}

// Calculate average speed for a set of attempts
export function calculateAverageSpeed(attempts: PracticeAttempt[]) {
	if (attempts.length === 0) return 0;

	const totalTime = attempts.reduce((sum, a) => sum + a.timeMs, 0);
	return totalTime / attempts.length;
}

// Generate heat map data for accuracy
export function generateAccuracyHeatMap(attempts: PracticeAttempt[]): HeatMapData[] {
	const heatMap: HeatMapData[] = [];

	// Group attempts by number pairs
	const grouped = attempts.reduce((acc, attempt) => {
		const key = `${attempt.firstNumber},${attempt.secondNumber}`;

		if (!acc[key]) {
			acc[key] = [];
		}

		acc[key].push(attempt);
		return acc;
	}, {} as Record<string, PracticeAttempt[]>);

	// Calculate accuracy for each pair
	Object.entries(grouped).forEach(([key, pairAttempts]) => {
		const [x, y] = key.split(',').map(Number);
		const accuracy = calculateAccuracy(pairAttempts);

		heatMap.push({
			x,
			y,
			value: accuracy,
		});
	});

	return heatMap;
}

// Generate heat map data for speed
export function generateSpeedHeatMap(attempts: PracticeAttempt[]): HeatMapData[] {
	const heatMap: HeatMapData[] = [];

	// Group attempts by number pairs
	const grouped = attempts.reduce((acc, attempt) => {
		const key = `${attempt.firstNumber},${attempt.secondNumber}`;

		if (!acc[key]) {
			acc[key] = [];
		}

		acc[key].push(attempt);
		return acc;
	}, {} as Record<string, PracticeAttempt[]>);

	// Calculate average speed for each pair
	Object.entries(grouped).forEach(([key, pairAttempts]) => {
		const [x, y] = key.split(',').map(Number);
		const speed = calculateAverageSpeed(pairAttempts);

		heatMap.push({
			x,
			y,
			value: speed,
		});
	});

	return heatMap;
}

// Generate progress data points
export function generateProgressData(attempts: PracticeAttempt[], days: number) {
	const now = new Date();
	const result = [];

	// Create date buckets for the specified number of days
	for (let i = 0; i < days; i++) {
		const date = new Date(now);
		date.setDate(date.getDate() - i);
		const dateStr = date.toLocaleDateString();

		result.unshift({
			date: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : dateStr,
			attempts: 0,
			accuracy: 0,
			speed: 0,
		});
	}

	// Group attempts by date
	const grouped = groupAttemptsByDate(attempts);

	// Fill in the data
	result.forEach(point => {
		const dateStr = point.date === 'Today'
			? new Date().toLocaleDateString()
			: point.date === 'Yesterday'
				? new Date(Date.now() - 86400000).toLocaleDateString()
				: point.date;

		const dayAttempts = grouped[dateStr] || [];

		if (dayAttempts.length > 0) {
			point.attempts = dayAttempts.length;
			point.accuracy = calculateAccuracy(dayAttempts);
			point.speed = calculateAverageSpeed(dayAttempts);
		}
	});

	return result;
}

// Get color for accuracy heat map
export function getAccuracyColor(value: number): string {
	if (value >= 90) return '#10B981'; // Green for high accuracy
	if (value >= 70) return '#FBBF24'; // Yellow for medium accuracy
	return '#EF4444'; // Red for low accuracy
}

// Get color for speed heat map (inverted - faster is better)
export function getSpeedColor(value: number): string {
	const maxSpeed = 5000; // 5 seconds
	const normalizedValue = Math.min(value, maxSpeed) / maxSpeed;
	const invertedValue = 1 - normalizedValue;

	if (invertedValue >= 0.7) return '#10B981'; // Green for fast
	if (invertedValue >= 0.4) return '#FBBF24'; // Yellow for medium
	return '#EF4444'; // Red for slow
}

// Format accuracy value
export function formatAccuracy(value: number): string {
	return `${Math.round(value)}%`;
}

// Format speed value
export function formatSpeed(value: number): string {
	return `${Math.round(value)}ms`;
}