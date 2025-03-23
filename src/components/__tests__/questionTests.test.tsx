import React, { Suspense } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { questions } from "@/data/questions";

// Get questionId from environment variable or default to "q2"
const questionId = process.env.TEST_QUESTION_ID || "q2";
console.log(`Running tests for question ID: ${questionId}`);

// Find the question to test
const currentQuestion = questions.find(q => q.id === questionId);
const DynamicComponent = React.lazy(() =>
    import(`../questions/${questionId}/index.tsx`))

if (!currentQuestion) {
    throw new Error(`Question not found in questions data: ${questionId}`);
}

describe('Question Tests', () => {
    describe(currentQuestion.title, () => {
        beforeEach(async () => {
            await act(async () => {
                render(
                    <Suspense fallback={<div>Loading...</div>}>
                        <DynamicComponent />
                    </Suspense>
                );
            });
        });

        currentQuestion.testCases.forEach(testCase => {
            it(`[${testCase.id}] ${testCase.description}`, async () => {
                console.log(`Running test: ${testCase.id} - ${testCase.description}`);

                if (testCase.testImplementation) {
                    await act(async () => {
                        testCase.testImplementation({ screen, fireEvent });
                        // Add a small delay to ensure state updates are processed
                        await new Promise(resolve => setTimeout(resolve, 0));
                    });
                    console.log(`Test ${testCase.id} completed`);
                } else {
                    console.warn(`No test implementation found for test case: ${testCase.id}`);
                }
            });
        });
    });
}); 