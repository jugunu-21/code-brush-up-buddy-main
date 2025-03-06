import React, { Suspense } from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { TestCase } from './types';

export const runTestImplementation = async (
    questionId: string,
    testCase: TestCase
): Promise<boolean> => {
    try {
        // For now, we only support Counter component
        if (questionId !== 'q1') {
            throw new Error('Only Counter component tests are supported for now');
        }

        // Clean up any previous renders
        cleanup();

        try {
            // Create a test container and render with Suspense
            await act(async () => {
                render(
                    <Suspense fallback={< div > Loading...</div>}>
                    <Counter />
            </Suspense>
            );
        });

        // Run the test implementation with proper error handling
        if (testCase.testImplementation) {
            try {
                await act(async () => {
                    await testCase.testImplementation({
                        screen: {
                            ...screen,
                            getByRole: (role: string, options?: any) => {
                                const element = screen.getByRole(role, options);
                                if (!element) throw new Error(`Element with role ${role} not found`);
                                return element;
                            },
                            getByText: (text: string) => {
                                const element = screen.getByText(text);
                                if (!element) throw new Error(`Element with text ${text} not found`);
                                return element;
                            }
                        },
                        fireEvent
                    });
                });
                return true;
            } catch (error) {
                console.error('Test implementation failed:', error);
                return false;
            }
        }
        return false;
    } finally {
        // Clean up after test
        cleanup();
    }
} catch (error) {
    console.error('Test setup failed:', error);
    return false;
}
}; 