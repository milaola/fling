import { createContext, useEffect, useState } from 'react';

const FlingContext = createContext();

export function FlingProvider({ children }) {
    const [darkMode, setDarkMode] = useState(true);
    const [score, setScore] = useState(0);
    const [launches, setLaunches] = useState(0);

    useEffect(() => {
        const savedScore = localStorage.getItem("fling-score");

        if (savedScore) {
            setScore(Number(savedScore));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("fling-score", score);
    }, [score]);

    const addScore = (points) => {
        setScore((currentScore) => currentScore + points);
    };

    const addLuanch = () => {
        setLaunches((currentLaunches) => currentLaunches + 1);
    };

    const resetGame = () => {
        setScore(0);
        setLaunches(0);
    };

    return (
        <FlingContext.Provider
            value={{
                darkMode,
                setDarkMode,
                score,
                launches,
                addScore,
                addLaunch,
                resetGame,
            }}
        >
            {children}
        </FlingContext.Provider>
    );
}


export default FlingContext