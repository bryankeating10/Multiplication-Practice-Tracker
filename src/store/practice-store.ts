import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PracticeAttempt, PracticeSettings } from '@/types/practice';

interface PracticeState {
	// Current practice state
	currentProblem: {
		firstNumber: number;
		secondNumber: number;
		startTime: number;
	} | null;

	// History and settings
	attempts: PracticeAttempt[];
	settings: PracticeSettings;

	// Actions
	generateProblem: () => void;
	submitAnswer: (answer: number) => PracticeAttempt | null;
	updateSettings: (settings: Partial<PracticeSettings>) => void;
	clearHistory: () => void;
}

export const usePracticeStore = create<PracticeState>()(
	persist(
		(set, get) => ({
			currentProblem: null,
			attempts: [],
			settings: {
				mode: 'bucket',
				excludedBuckets: [],
				includedBuckets: [],
				minNumber: 2,
				maxNumber: 20,
			},

			generateProblem: () => {
				const { settings } = get();
				let firstNumber: number;
				let secondNumber: number;

				// Determine available numbers based on include/exclude logic
				let availableNumbers: number[] = [];

				// If specific buckets are included, use only those
				if (settings.includedBuckets && settings.includedBuckets.length > 0) {
					availableNumbers = [...settings.includedBuckets];
				} else {
					// Otherwise, use all numbers except excluded ones
					const excludedBuckets = settings.excludedBuckets || [];
					for (let i = settings.minNumber; i <= settings.maxNumber; i++) {
						if (!excludedBuckets.includes(i)) {
							availableNumbers.push(i);
						}
					}
				}

				// If no numbers available, fall back to all numbers
				if (availableNumbers.length === 0) {
					for (let i = settings.minNumber; i <= settings.maxNumber; i++) {
						availableNumbers.push(i);
					}
				}

				// Generate random problem from available numbers
				firstNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
				secondNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];

				set({
					currentProblem: {
						firstNumber,
						secondNumber,
						startTime: Date.now(),
					}
				});
			},

			submitAnswer: (answer: number) => {
				const { currentProblem, attempts } = get();

				if (!currentProblem) return null;

				const { firstNumber, secondNumber, startTime } = currentProblem;
				const correctAnswer = firstNumber * secondNumber;
				const timeMs = Date.now() - startTime;
				const isCorrect = answer === correctAnswer;

				const attempt: PracticeAttempt = {
					id: Date.now().toString(),
					firstNumber,
					secondNumber,
					userAnswer: answer,
					correctAnswer,
					timeMs,
					timestamp: Date.now(),
					isCorrect,
				};

				set({
					attempts: [attempt, ...attempts],
					currentProblem: null,
				});

				return attempt;
			},

			updateSettings: (newSettings) => {
				set((state) => ({
					settings: {
						...state.settings,
						...newSettings,
					}
				}));
			},

			clearHistory: () => {
				set({ attempts: [] });
			},
		}),
		{
			name: 'practice-storage',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				attempts: state.attempts,
				settings: state.settings,
			}),
		}
	)
);