import React, { useState } from 'react';

export const Counter = () => {
    const [count, setCount] = useState(0);

    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);

    return (
        <div className="p-4 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold">{count}</h2>
            <div className="flex gap-2">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={decrement}
                >
                    -
                </button>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={increment}
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default Counter; 