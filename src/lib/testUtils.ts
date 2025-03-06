import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestCase } from './types';
import Counter from '../components/Counter';

// Dynamic import function type
type DynamicImport = () => Promise<{ default: React.ComponentType }>;

// Map of component imports
const componentImports: Record<string, DynamicImport> = {
    q1: () => import('../components/Counter'),
    q2: () => import('../components/Toggle'),
    q3: () => import('../components/UserList'),
    q4: () => import('../components/CallbackExample'),
    q5: () => import('../components/Calculator'),
};

export const runTestImplementation = async (
    questionId: string,
    testCase: TestCase
): Promise<boolean> => {
    try {
        // For now, we only support Counter component
        if (questionId !== 'q1') {
            throw new Error('Only Counter component tests are supported for now');
        }

        // Create a new div for test container
        const container = document.createElement('div');
        document.body.appendChild(container);

        try {
            // Render the Counter component
            render(<Counter />, { container });

            // Run the test implementation
            if (testCase.testImplementation) {
                await testCase.testImplementation({ screen, fireEvent });
                return true;
            } else {
                console.warn(`No test implementation found for test case: ${testCase.id}`);
                return false;
            }
        } finally {
            // Clean up
            document.body.removeChild(container);
        }
    } catch (error) {
        console.error(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return false;
    }
}; 