export interface PracticeAttempt {
	id: string;
	firstNumber: number;
	secondNumber: number;
	userAnswer: number;
	correctAnswer: number;
	timeMs: number;
	timestamp: number;
	isCorrect: boolean;
}

export interface HeatMapData {
	x: number;
	y: number;
	value: number;
}

export interface BucketOption {
	id: string;
	label: string;
	value: number | null;
	isSelected: boolean;
}

export type PracticeMode = 'random' | 'bucket';

export interface PracticeSettings {
	mode: PracticeMode;
	excludedBuckets: number[];
	includedBuckets: number[];
	minNumber: number;
	maxNumber: number;
}

export interface StatsTimeRange {
	label: string;
	days: number;
}