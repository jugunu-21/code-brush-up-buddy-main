import React, { useState } from 'react';

export const Counter = () => {
  // Initialize count state with 0
  const [count, setCount] = useState(0);

  // Function to increment count by 1
  const increment = () => {
    setCount(count + 1);
  };

  // Function to decrement count by 1
  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <h2>{count}</h2>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  );
};

export default Counter;
