
import { Question } from "@/lib/types";

// Test functions will be implemented as string evaluations in the real app
// Just placeholders here for demonstration

export const questions: Question[] = [
  {
    id: "q1",
    title: "Create a Counter Component",
    description: `
    Create a simple counter component that has:
    
    1. A display showing the current count (starting at 0)
    2. An increment button that adds 1 to the count
    3. A decrement button that subtracts 1 from the count
    
    Use React's useState hook to manage the counter state.
    `,
    difficulty: "easy",
    topics: ["React Hooks", "State Management", "Components"],
    averageTimeMin: 5,
    starterCode: `import React from 'react';

export const Counter = () => {
  // Implement your counter component here
  
  return (
    <div>
      {/* Your counter UI here */}
    </div>
  );
};

export default Counter;`,
    testCases: [
      {
        id: "q1t1",
        description: "Component renders without crashing",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q1t2",
        description: "Initial count value is 0",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q1t3",
        description: "Clicking increment button increases count by 1",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q1t4",
        description: "Clicking decrement button decreases count by 1",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      }
    ],
    hints: [
      {
        id: "q1h1",
        text: "Use the useState hook to create a state variable for the count."
      },
      {
        id: "q1h2",
        text: "The useState hook returns an array with two elements: the current state value and a function to update it."
      },
      {
        id: "q1h3",
        text: "Create onClick handlers for your buttons that call the state update function."
      }
    ],
    solution: `import React, { useState } from 'react';

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

export default Counter;`
  },
  {
    id: "q2",
    title: "Toggle Component with useEffect",
    description: `
    Create a toggle component that:
    
    1. Displays either "ON" or "OFF" based on its state
    2. Has a toggle button that switches between states
    3. Logs "Toggle changed to: ON/OFF" to the console whenever the state changes (using useEffect)
    
    Use both useState and useEffect hooks.
    `,
    difficulty: "medium",
    topics: ["React Hooks", "State Management", "Components", "Lifecycle Methods"],
    averageTimeMin: 8,
    starterCode: `import React from 'react';

export const Toggle = () => {
  // Implement your toggle component here
  
  return (
    <div>
      {/* Your toggle UI here */}
    </div>
  );
};

export default Toggle;`,
    testCases: [
      {
        id: "q2t1",
        description: "Component renders without crashing",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q2t2",
        description: "Initial state displays 'OFF'",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q2t3",
        description: "Clicking toggle button changes display to 'ON'",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q2t4",
        description: "Console log is called when state changes",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      }
    ],
    hints: [
      {
        id: "q2h1",
        text: "Use useState to track whether the toggle is on or off (boolean value)."
      },
      {
        id: "q2h2",
        text: "Use useEffect with the toggle state as a dependency to run code when the state changes."
      },
      {
        id: "q2h3",
        text: "Inside the useEffect callback, use console.log to output the current state."
      }
    ],
    solution: `import React, { useState, useEffect } from 'react';

export const Toggle = () => {
  const [isOn, setIsOn] = useState(false);
  
  useEffect(() => {
    console.log(\`Toggle changed to: \${isOn ? 'ON' : 'OFF'}\`);
  }, [isOn]);
  
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

export default Toggle;`
  },
  {
    id: "q3",
    title: "Fetch Data with useEffect",
    description: `
    Create a component that fetches and displays a list of users from the JSONPlaceholder API.
    
    Requirements:
    1. Fetch users from https://jsonplaceholder.typicode.com/users when the component mounts
    2. Display a loading state while fetching
    3. Display the list of users with their names and emails
    4. Handle any potential errors during fetching
    
    Use useState and useEffect hooks together.
    `,
    difficulty: "hard",
    topics: ["React Hooks", "State Management", "Lifecycle Methods", "Rendering"],
    averageTimeMin: 15,
    starterCode: `import React from 'react';

export const UserList = () => {
  // Implement your UserList component here
  
  return (
    <div>
      {/* Your user list UI here */}
    </div>
  );
};

export default UserList;`,
    testCases: [
      {
        id: "q3t1",
        description: "Component renders without crashing",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q3t2",
        description: "Loading state is displayed initially",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q3t3",
        description: "Users are displayed after loading",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q3t4",
        description: "Error state is handled properly",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      }
    ],
    hints: [
      {
        id: "q3h1",
        text: "Use useState to create state variables for users, loading status, and errors."
      },
      {
        id: "q3h2",
        text: "Use useEffect with an empty dependency array to run the fetch only once when the component mounts."
      },
      {
        id: "q3h3",
        text: "Use try/catch inside the useEffect to handle potential fetch errors."
      },
      {
        id: "q3h4",
        text: "Use conditional rendering to show different UI states based on loading/error states."
      }
    ],
    solution: `import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  if (loading) {
    return <div className="p-4 text-center">Loading users...</div>;
  }
  
  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.id} className="p-3 border rounded shadow-sm">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;`
  },
  {
    id: "q4",
    title: "useCallback for Performance",
    description: `
    Create a component that contains:
    
    1. A counter state
    2. A button to increment the counter
    3. A child component that receives a callback function to log the counter value
    
    Use useCallback to optimize the callback function so the child component doesn't re-render unnecessarily.
    
    Bonus: Use React.memo for the child component.
    `,
    difficulty: "hard",
    topics: ["React Hooks", "Performance", "Components", "Props"],
    averageTimeMin: 12,
    starterCode: `import React from 'react';

// Child component
const LogButton = ({ onClick }) => {
  console.log('LogButton rendered');
  return <button onClick={onClick}>Log Counter Value</button>;
};

export const CallbackExample = () => {
  // Implement your component here
  
  return (
    <div>
      {/* Your UI here */}
    </div>
  );
};

export default CallbackExample;`,
    testCases: [
      {
        id: "q4t1",
        description: "Component renders without crashing",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q4t2",
        description: "Counter increments when button is clicked",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q4t3",
        description: "LogButton logs the current counter value when clicked",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q4t4",
        description: "LogButton doesn't re-render when counter changes",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      }
    ],
    hints: [
      {
        id: "q4h1",
        text: "Use useState to create a counter state."
      },
      {
        id: "q4h2",
        text: "Use useCallback to memoize the logging function."
      },
      {
        id: "q4h3",
        text: "Make sure the useCallback dependency array is empty to prevent recreation."
      },
      {
        id: "q4h4",
        text: "Use React.memo to wrap the child component."
      },
      {
        id: "q4h5",
        text: "When using React.memo without useCallback, the child will still re-render on parent updates."
      }
    ],
    solution: `import React, { useState, useCallback } from 'react';

// Child component
const LogButton = React.memo(({ onClick }) => {
  console.log('LogButton rendered');
  return (
    <button 
      className="px-4 py-2 bg-green-500 text-white rounded"
      onClick={onClick}
    >
      Log Counter Value
    </button>
  );
});

export const CallbackExample = () => {
  const [counter, setCounter] = useState(0);
  
  // This function is memoized and won't change on re-renders
  const handleLogClick = useCallback(() => {
    console.log('Current counter value:', counter);
  }, [counter]); // Include counter in dependencies if you want it to update
  
  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold">Counter: {counter}</h2>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setCounter(counter + 1)}
      >
        Increment
      </button>
      <LogButton onClick={handleLogClick} />
      <p className="text-sm text-gray-500">
        Check console to see render logs and counter value
      </p>
    </div>
  );
};

export default CallbackExample;`
  },
  {
    id: "q5",
    title: "useMemo for Expensive Calculations",
    description: `
    Create a component that:
    
    1. Takes an array of numbers as input
    2. Has a toggle button to show/hide results
    3. When results are shown, displays the sum and product of all numbers
    
    Use useMemo to optimize the calculations so they don't run on every render.
    `,
    difficulty: "medium",
    topics: ["React Hooks", "Performance", "Rendering"],
    averageTimeMin: 10,
    starterCode: `import React from 'react';

export const Calculator = () => {
  // Sample data
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // Implement your component here
  
  return (
    <div>
      {/* Your UI here */}
    </div>
  );
};

export default Calculator;`,
    testCases: [
      {
        id: "q5t1",
        description: "Component renders without crashing",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q5t2",
        description: "Toggle button shows/hides results",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q5t3",
        description: "Sum calculation is correct (should be 55)",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q5t4",
        description: "Product calculation is correct (should be 3628800)",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      },
      {
        id: "q5t5",
        description: "useMemo is used to optimize calculations",
        expectedOutput: true,
        testFunction: (code: string) => true, // Placeholder implementation
      }
    ],
    hints: [
      {
        id: "q5h1",
        text: "Use useState to track whether results should be displayed."
      },
      {
        id: "q5h2",
        text: "Use useMemo for both the sum and product calculations."
      },
      {
        id: "q5h3",
        text: "The dependency array for useMemo should include the 'numbers' array."
      },
      {
        id: "q5h4",
        text: "Sum can be calculated using Array.reduce((sum, num) => sum + num, 0)."
      },
      {
        id: "q5h5",
        text: "Product can be calculated using Array.reduce((product, num) => product * num, 1)."
      }
    ],
    solution: `import React, { useState, useMemo } from 'react';

export const Calculator = () => {
  // Sample data
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [showResults, setShowResults] = useState(false);
  
  // Memoized calculations that only run when 'numbers' changes
  const sum = useMemo(() => {
    console.log('Calculating sum...'); // To demonstrate memoization
    return numbers.reduce((total, num) => total + num, 0);
  }, [numbers]);
  
  const product = useMemo(() => {
    console.log('Calculating product...'); // To demonstrate memoization
    return numbers.reduce((total, num) => total * num, 1);
  }, [numbers]);
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Number Calculations</h2>
      
      <div className="bg-gray-100 p-3 rounded mb-4">
        <h3 className="font-semibold mb-2">Numbers:</h3>
        <div className="flex flex-wrap gap-2">
          {numbers.map((num, index) => (
            <span key={index} className="bg-white px-2 py-1 rounded shadow-sm">
              {num}
            </span>
          ))}
        </div>
      </div>
      
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
        onClick={() => setShowResults(!showResults)}
      >
        {showResults ? 'Hide Results' : 'Show Results'}
      </button>
      
      {showResults && (
        <div className="space-y-2">
          <p className="p-3 bg-green-100 rounded">
            <span className="font-semibold">Sum:</span> {sum}
          </p>
          <p className="p-3 bg-purple-100 rounded">
            <span className="font-semibold">Product:</span> {product}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Check console to see when calculations run
          </p>
        </div>
      )}
    </div>
  );
};

export default Calculator;`
  }
];
