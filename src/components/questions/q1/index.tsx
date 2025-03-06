import React, { useState, useCallback } from 'react';

export const Counter = () => {
  // Initialize count state with 0
  const [count, setCount] = useState(0);

  // Function to increment count by 1
  const increment = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []);

  // Function to decrement count by 1
  const decrement = useCallback(() => {
    setCount(prevCount => prevCount - 1);
  }, []);

  return (
    <div>
      <h2 aria-label="Counter value">{count}</h2>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
};

export default Counter;
