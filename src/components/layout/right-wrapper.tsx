import React, { useRef } from 'react';
import { Word } from '../letter';

const RightWrapper = () => {
	const audioContextRef = useRef<AudioContext | null>(null);
	const oscillatorRef = useRef<OscillatorNode | null>(null);
	const playFrequency = (frequency: number) => {
		if (!audioContextRef.current) {
			audioContextRef.current = new (window.AudioContext || window.AudioContext)();
		}
		const audioContext = audioContextRef.current;

		if (oscillatorRef.current) {
			oscillatorRef.current.stop();
		}

		const oscillator = audioContext.createOscillator();
		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

		const gainNode = audioContext.createGain();
		gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.start();

		oscillatorRef.current = oscillator;
	};

	const stopSound = () => {
		if (oscillatorRef.current) {
			oscillatorRef.current.stop();
			oscillatorRef.current = null;
		}
	};
	return (
		<div className="flex-1 p-8 bg-gray-700 text-white">
			<Word word="good" />
			<div className="flex gap-4 mt-4">
				<button
					className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
					onMouseDown={() => playFrequency(440)}
					onMouseUp={stopSound}
					onMouseLeave={stopSound}
				>
					Play 440 Hz
				</button>
				<button
					className="bg-green-500 text-white font-bold py-2 px-4 rounded"
					onMouseDown={() => playFrequency(523.25)}
					onMouseUp={stopSound}
					onMouseLeave={stopSound}
				>
					Play 523.25 Hz
				</button>
			</div>
		</div>
	);
};

export default RightWrapper;
