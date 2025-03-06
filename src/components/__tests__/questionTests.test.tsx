import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { questions } from "@/data/questions";
import Counter from '../Counter';

// For now, we'll only test the Counter component
const counterQuestion = questions.find(q => q.id === "q1");
if (!counterQuestion) {
    throw new Error("Counter question not found in questions data");
}

describe('Question Tests', () => {
    describe(counterQuestion.title, () => {
        beforeEach(() => {
            render(<Counter />);
        });

        counterQuestion.testCases.forEach(testCase => {
            it(testCase.description, () => {
                if (testCase.testImplementation) {
                    testCase.testImplementation({ screen, fireEvent });
                } else {
                    console.warn(`No test implementation found for test case: ${testCase.id}`);
                }
            });
        });
    });
}); 