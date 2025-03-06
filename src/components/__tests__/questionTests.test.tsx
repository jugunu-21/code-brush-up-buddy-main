import React, { Suspense } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { questions } from "@/data/questions";

const questionId = "q2"
// For now, we'll only test the Counter component
const currentQuestion = questions.find(q => q.id === questionId);
const DynamicComponent = React.lazy(() =>
    import(`../questions/${questionId}/index.tsx`))

if (!currentQuestion) {
    throw new Error("Question not found in questions data");
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
            it(testCase.description, async () => {
                if (testCase.testImplementation) {
                    await act(async () => {
                        testCase.testImplementation({ screen, fireEvent });
                        // Add a small delay to ensure state updates are processed
                        await new Promise(resolve => setTimeout(resolve, 0));
                    });
                } else {
                    console.warn(`No test implementation found for test case: ${testCase.id}`);
                }
            });
        });
    });
}); 