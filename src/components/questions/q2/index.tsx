import React, { useState, useEffect } from 'react';

export const Toggle = () => {
    // Initialize state for toggle
    const [isOn, setIsOn] = useState(false);

    // Add effect to log state changes
    useEffect(() => {
        console.log(`Toggle changed to: ${isOn ? 'ON' : 'OFF'}`);
    }, [isOn]);

    // Handle toggle button click
    const handleToggle = () => {
        setIsOn(!isOn);
    };

    return (
        <div className="p-4 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold">{isOn ? 'ON' : 'OFF'}</h2>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleToggle}
            >
                Toggle
            </button>
        </div>
    );
};

export default Toggle;