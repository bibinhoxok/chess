"use client"

import React, { useRef, useState } from "react"
import Alert from "../alert/alert"
import BorderedBox from "../gui/bordered-box"
import Word from "../gui/letter"

const Tools = () => {
    const audioContextRef = useRef<AudioContext | null>(null)
    const oscillatorRef = useRef<OscillatorNode | null>(null)
    const [alert, setAlert] = useState<{
        message: string
        type: "info" | "success" | "warning" | "error"
    } | null>(null)

    const playFrequency = (frequency: number) => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (
                window.AudioContext || (window as any).webkitAudioContext
            )()
        }
        const audioContext = audioContextRef.current

        if (oscillatorRef.current) {
            oscillatorRef.current.stop()
        }

        const oscillator = audioContext.createOscillator()
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)

        const gainNode = audioContext.createGain()
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.start()

        oscillatorRef.current = oscillator
    }

    const stopSound = () => {
        if (oscillatorRef.current) {
            oscillatorRef.current.stop()
            oscillatorRef.current = null
        }
    }

    const handleShowAlert = () => {
        setAlert({ message: "This is a custom alert!", type: "success" })
    }

    const handleCloseAlert = () => {
        setAlert(null)
    }

    return (
        <div className="flex flex-col gap-4">
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={handleCloseAlert}
                />
            )}

            <div className="flex justify-center">
                <BorderedBox height={10} width={15}>
                    <Word char="good" />
                </BorderedBox>
            </div>


            <div className="flex gap-4 mt-4 flex-wrap justify-center">
                <button
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                    onMouseDown={() => playFrequency(440)}
                    onMouseUp={stopSound}
                    onMouseLeave={stopSound}
                >
                    Play 440 Hz
                </button>
                <button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors"
                    onMouseDown={() => playFrequency(523.25)}
                    onMouseUp={stopSound}
                    onMouseLeave={stopSound}
                >
                    Play 523.25 Hz
                </button>
                <button
                    className="bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-600 transition-colors"
                    onClick={handleShowAlert}
                >
                    Show Custom Alert
                </button>
            </div>
        </div>
    )
}

export default Tools
