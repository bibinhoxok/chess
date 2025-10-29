
import React, { CSSProperties } from 'react';

interface LetterProps {
    char: string;
}

const Letter: React.FC<LetterProps> = ({ char }: LetterProps) => {
    const charMap: { [key: string]: [charWidth: number, charHeight: number, charX: number, charY: number] } = {
        'A': [6, 7, 1, 1], 'B': [6, 7, 8, 1], 'C': [6, 7, 15, 1], 'D': [6, 7, 22, 1], 'E': [5, 7, 29, 1], 'F': [5, 7, 35, 1], 'G': [6, 7, 41, 1], 'H': [6, 7, 48, 1], 'I': [4, 7, 55, 1], 'J': [6, 7, 60, 1], 'K': [6, 7, 67, 1],
        'L': [6, 7, 1, 10], 'M': [6, 7, 8, 10], 'N': [6, 7, 15, 10], 'O': [6, 7, 22, 10], 'P': [6, 7, 29, 10], 'Q': [6, 7, 36, 10], 'R': [6, 7, 43, 10], 'S': [6, 7, 50, 10], 'T': [6, 7, 57, 10], 'U': [6, 7, 64, 10], 'V': [6, 7, 72, 10], 'W': [6, 7, 72, 10],'X': [6, 7, 79, 10], 'Y': [6, 7, 86, 10], 'Z': [6, 7, 93, 10],
        '0': [6, 7, 1, 19], '1': [4, 7, 8, 19], '2': [6, 7, 13, 19], '3': [6, 7, 20, 19], '4': [7, 7, 27, 19], '5': [6, 7, 35, 19], '6': [6, 7, 42, 19], '7': [6, 7, 49, 19], '8': [6, 7, 56, 19], '9': [6, 7, 63, 19], '?': [5, 7, 70, 19], '!': [2, 7, 76, 19],
    };
    const scale = 10;

    const charData = charMap[char.toUpperCase()];

    if (!charData) {
        return null;
    }

    const [charWidth, charHeight, charX, charY] = charData;
    const backgroundPosition = `-${charX * scale}px -${charY * scale}px`;
    const baseStyle: CSSProperties = {
        backgroundImage: 'url(/pixel_chess_16x16_byBrysia/GUI/letters_numbers.png)',
        backgroundPosition,
        backgroundSize: `${100 * scale}px ${27 * scale}px`,
        width: `${charWidth * scale}px`,
        height: `${charHeight * scale}px`,
        imageRendering: 'pixelated',
    }
    if (char.toUpperCase() === 'W') {
        return (
            <div style={{ display: 'flex', margin: '2px' }}>
                <div style={baseStyle} />
                <div style={{ ...baseStyle, marginLeft: '-30px' }} />
            </div>
        );
    }

    return (
        <div
            style={{
                ...baseStyle,
                margin: '2px',
            }}
        />
    );
};

export const Word = ({ word }: { word: string }) => {
    return (
        <div style={{ display: 'flex' }}>
            {word.split('').map((char, index) => {
                if (char === ' ') {
                    return <div key={index} style={{ width: '40px' }} />;
                }
                return <Letter key={index} char={char} />;
            })}
        </div>
    );
};

export default Letter;
