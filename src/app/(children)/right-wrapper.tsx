import React, { useRef, useState } from 'react';
import { Word } from '../../../components/gui/letter';
import Alert from '../../../components/alert/alert';
import BorderedBox from '../../../components/gui/bordered-box';

const RightWrapper = () => {
	const audioContextRef = useRef<AudioContext | null>(null);
	const oscillatorRef = useRef<OscillatorNode | null>(null);
	const [alert, setAlert] = useState<{ message: string; type: 'info' | 'success' | 'warning' | 'error' } | null>(null);

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

	const handleShowAlert = () => {
		setAlert({ message: 'This is a custom alert!', type: 'success' });
	};

	const handleCloseAlert = () => {
		setAlert(null);
	};

	return (
		<div className="flex-1 p-8 bg-gray-700 text-white items-center justify-center">
			{alert && <Alert message={alert.message} type={alert.type} onClose={handleCloseAlert} />}

			<BorderedBox height={10} width={15}>
				<Word word="good" />
			</BorderedBox>
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
				<button
					className="bg-purple-500 text-white font-bold py-2 px-4 rounded"
					onClick={handleShowAlert}
				>
					Show Custom Alert
				</button>
			</div>
		</div>
	);
};

export default RightWrapper;
