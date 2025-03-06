import React, { useState } from 'react';
import { questions } from '@/data/questions';
import { Question, TestCase } from '@/lib/types';
import { runTestImplementation } from '@/lib/testUtils';

interface TestResult {
    id: string;
    description: string;
    passed: boolean;
    error?: string;
}

interface QuestionTestResults {
    questionId: string;
    title: string;
    results: TestResult[];
}

export const TestRunner: React.FC = () => {
    const [testResults, setTestResults] = useState<QuestionTestResults[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const runTests = async () => {
        setIsRunning(true);
        const results: QuestionTestResults[] = [];

        for (const question of questions) {
            const questionResults = await runTestsForQuestion(question);
            results.push(questionResults);
        }

        setTestResults(results);
        setIsRunning(false);
    };

    const runTestsForQuestion = async (question: Question): Promise<QuestionTestResults> => {
        const results: TestResult[] = [];

        for (const testCase of question.testCases) {
            try {
                const passed = await runTestImplementation(question.id, testCase);
                results.push({
                    id: testCase.id,
                    description: testCase.description,
                    passed,
                });
            } catch (error) {
                results.push({
                    id: testCase.id,
                    description: testCase.description,
                    passed: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }

        return {
            questionId: question.id,
            title: question.title,
            results,
        };
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <button
                    onClick={runTests}
                    disabled={isRunning}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                >
                    {isRunning ? 'Running Tests...' : 'Run All Tests'}
                </button>
            </div>

            {testResults.map((questionResult) => (
                <div key={questionResult.questionId} className="mb-6 border rounded p-4">
                    <h2 className="text-xl font-bold mb-2">{questionResult.title}</h2>
                    <div className="space-y-2">
                        {questionResult.results.map((result) => (
                            <div
                                key={result.id}
                                className={`p-2 rounded ${result.passed ? 'bg-green-100' : 'bg-red-100'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <span
                                        className={`mr-2 ${result.passed ? 'text-green-600' : 'text-red-600'
                                            }`}
                                    >
                                        {result.passed ? '✓' : '✗'}
                                    </span>
                                    <span>{result.description}</span>
                                </div>
                                {result.error && (
                                    <p className="text-red-600 text-sm mt-1">{result.error}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}; 