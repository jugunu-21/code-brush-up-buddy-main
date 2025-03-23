import { useState, useEffect } from "react";
import { TestCase } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Play, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import { toast } from "sonner";

interface TestCaseRunnerProps {
  testCases: TestCase[];
  code: string;
  onTestsCompleted: (passedIds: string[]) => void;
}

// Simple implementation of testing utilities
const createTestUtils = (container: HTMLElement) => {
  // Simple implementation of screen.getByRole

  const getByRole = (role: string, options?: { name?: string, level?: number }) => {
    let elements: HTMLElement[] = [];

    if (role === "button") {
      elements = Array.from(container.querySelectorAll('button'));
      if (options?.name) {
        elements = elements.filter(el => el.textContent?.trim() === options.name);
      }
    } else if (role === "heading") {
      const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
      if (options?.level && options.level >= 1 && options.level <= 6) {
        elements = Array.from(container.querySelectorAll(`h${options.level}`));
      } else {
        elements = Array.from(container.querySelectorAll(headingTags.join(',')));
      }
    }
    // iam callingokk
    if (elements.length === 0) {
      throw new Error(`Unable to find an element with role "${role}"`);
    }

    return elements[0];
  };

  // Simple implementation of fireEvent
  const fireEvent = {
    click: (element: HTMLElement) => {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        button: 0
      });
      element.dispatchEvent(event);
    }
  };

  // Simple implementation of screen
  const screen = {
    getByRole,
    findByText: (text: string) => {
      return new Promise<HTMLElement>((resolve, reject) => {
        // Check immediately first
        const elements = Array.from(container.querySelectorAll('*'))
          .filter(el => el.textContent?.includes(text));

        if (elements.length > 0) {
          resolve(elements[0] as HTMLElement);
          return;
        }

        // If not found, set up a mutation observer to watch for changes
        const observer = new MutationObserver(() => {
          const elements = Array.from(container.querySelectorAll('*'))
            .filter(el => el.textContent?.includes(text));

          if (elements.length > 0) {
            resolve(elements[0] as HTMLElement);
            observer.disconnect();
          }
        });

        observer.observe(container, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true
        });

        // Set a timeout to reject if element is not found
        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Unable to find text "${text}"`));
        }, 1000);
      });
    }
  };

  return { screen, fireEvent };
};

// Simple implementation of expect
const createExpect = () => {
  return (actual: any) => {
    return {
      toBeInTheDocument: () => {
        if (!actual) {
          throw new Error('Element not found in the document');
        }
        return true;
      },
      toHaveTextContent: (expected: string) => {
        if (!actual || !actual.textContent) {
          throw new Error('Element does not have text content');
        }
        if (!actual.textContent.includes(expected)) {
          throw new Error(`Expected element to have text content "${expected}" but found "${actual.textContent}"`);
        }
        return true;
      }
    };
  };
};

const TestCaseRunner = ({ testCases, code, onTestsCompleted }: TestCaseRunnerProps) => {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [running, setRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<Record<string, string>>({});
  const [output, setOutput] = useState('');
  const [matchInfo, setMatchInfo] = useState<Record<string, { method: string, description: string }>>({});
  const [testSummary, setTestSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
    questionId?: string;
  } | null>(null);

  // Extract questionId from the first test case ID (they all share the same question prefix)
  const questionId = testCases.length > 0 ? testCases[0].id.split('t')[0] : '';

  const runTests = async () => {
    setRunning(true);
    setOutput('');
    toast.info(`Running tests for ${questionId}...`);

    try {
      // Send the questionId to the server
      const response = await axios.post('http://localhost:8000/run-tests', {
        questionId: questionId
      });

      // Set the full output for display
      setOutput(response.data.rawOutput || '');

      // Process the parsed test results
      const { testResults, summary } = response.data;
      console.log('Received test results:', testResults);
      console.log('Summary:', summary);

      // Store the summary information
      setTestSummary(summary);

      // Set up new results and output
      const newResults: Record<string, boolean> = {};
      const newTestOutput: Record<string, string> = {};
      const newMatchInfo: Record<string, { method: string, description: string }> = {};

      // Directly map test results by ID
      if (testResults && testResults.length > 0) {
        // Process each test result
        testResults.forEach(result => {
          // Find the matching test case in our list
          const testCase = testCases.find(tc => tc.id === result.id);
          if (testCase) {
            // Mark as passed or failed
            newResults[result.id] = result.status === 'passed';

            // Store the test description for display
            newMatchInfo[result.id] = {
              method: 'Direct ID match',
              description: result.description
            };

            // If failed, extract error information from raw output
            if (result.status === 'failed') {
              // Look for error message in the output
              const lines = response.data.rawOutput.split('\n');
              const testLineIndex = lines.findIndex(line => line.includes(`[${result.id}]`) && line.includes('✕'));

              if (testLineIndex !== -1) {
                // Find error details
                const errorLines = [];
                let i = testLineIndex + 1;

                // Look for error marker
                while (i < lines.length && !lines[i].includes('●')) {
                  i++;
                }

                // Collect error message
                if (i < lines.length) {
                  // Start with the error title line
                  errorLines.push(lines[i].trim());
                  i++;

                  // Collect the next few relevant lines (expected, received, etc.)
                  let lineCount = 0;
                  const maxLines = 5;

                  while (i < lines.length && lineCount < maxLines) {
                    const line = lines[i].trim();

                    // Skip stack trace lines
                    if (line.startsWith('at ')) {
                      i++;
                      continue;
                    }

                    // Add non-empty, relevant lines
                    if (line !== '' && !line.startsWith('●') && !line.includes('✓') && !line.includes('✕')) {
                      errorLines.push(line);
                      lineCount++;
                    } else if (line.startsWith('●') || line.includes('✓') || line.includes('✕')) {
                      // Stop at the next test
                      break;
                    }
                    i++;
                  }
                }

                if (errorLines.length > 0) {
                  newTestOutput[result.id] = errorLines.join('\n');
                } else {
                  newTestOutput[result.id] = 'Test failed';
                }
              }
            }
          }
        });

        // Set default for any tests not found in results
        testCases.forEach(testCase => {
          if (!(testCase.id in newResults)) {
            newResults[testCase.id] = false;
            newTestOutput[testCase.id] = 'Test was not executed or could not be matched';
          }
        });
      } else {
        // Fallback if no structured results
        const hasFailures = !response.data.success;

        testCases.forEach(test => {
          newResults[test.id] = !hasFailures;
          if (hasFailures) {
            newTestOutput[test.id] = 'Test failed during execution';
          }
        });
      }

      setResults(newResults);
      setTestOutput(newTestOutput);
      setMatchInfo(newMatchInfo);

      // Pass the IDs of passed tests back to the parent
      const passedIds = Object.entries(newResults)
        .filter(([_, passed]) => passed)
        .map(([id]) => id);

      onTestsCompleted(passedIds);

      // Show appropriate toast
      if (summary) {
        if (summary.failed === 0) {
          toast.success(`All ${summary.total} tests passed!`);
        } else {
          toast.info(`${summary.passed} of ${summary.total} tests passed`);
        }
      } else {
        const passCount = passedIds.length;
        if (passCount === testCases.length) {
          toast.success('All tests passed successfully!');
        } else if (passCount > 0) {
          toast.info(`${passCount}/${testCases.length} tests passed`);
        } else {
          toast.error('All tests failed');
        }
      }
    } catch (error) {
      console.error('Error running tests:', error);
      toast.error('Failed to connect to test server');
      setOutput(`Error: ${error.response?.data?.error || error.message}`);

      // Mark all tests as not run by clearing results
      setResults({});
    } finally {
      setRunning(false);
    }
  };

  const passedCount = Object.values(results).filter(Boolean).length;
  const totalTests = testCases.length;
  const allPassed = passedCount === totalTests && totalTests > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Test Cases</h3>
        <Button
          onClick={runTests}
          disabled={running}
          className="gap-2"
        >
          {running ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Tests {questionId && `(${questionId})`}
            </>
          )}
        </Button>
      </div>

      {/* {output && (
        <Alert className="mt-4 bg-gray-50 border-gray-200">
          <AlertDescription>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Test Output:</h4>
              <span className="text-xs text-muted-foreground">
                {passedCount} of {totalTests} tests passing
              </span>
            </div>
            <pre className="whitespace-pre-wrap text-xs max-h-60 overflow-y-auto bg-black/5 p-2 rounded">
              {output}
            </pre>
          </AlertDescription>
        </Alert>
      )} */}

      {Object.keys(results).length > 0 && (
        <Alert className={allPassed ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
          <AlertDescription className="flex justify-between items-center">
            <span>
              {allPassed
                ? `All tests passed! (${passedCount}/${totalTests})`
                : `${passedCount}/${totalTests} tests passing`}
              {testSummary?.questionId && ` for question ${testSummary.questionId}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={runTests}
              disabled={running}
              className="ml-2 text-xs h-7 px-2"
            >
              Run Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {testCases.map((testCase) => {
            const isRun = testCase.id in results;
            const isPassed = results[testCase.id] === true;

            return (
              <motion.div
                key={testCase.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-3 border rounded-md ${isRun
                  ? isPassed
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                  : "border-gray-200 bg-gray-50"
                  }`}
              >
                <div className="flex items-start gap-2">
                  {isRun ? (
                    isPassed ? (
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    )
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 shrink-0 mt-0.5" />
                  )}
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{testCase.description}</p>
                      <span className="text-xs text-muted-foreground ml-2 bg-black/5 px-1.5 py-0.5 rounded">
                        {testCase.id}
                      </span>
                    </div>

                    {matchInfo[testCase.id] && (
                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-muted-foreground">
                          Matched: <span className="font-mono bg-black/5 px-1 py-0.5 rounded">{matchInfo[testCase.id].description}</span>
                        </span>
                      </div>
                    )}

                    {isRun && !isPassed && (
                      <div className="mt-2">
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                          {testOutput[testCase.id] ? (
                            <pre className="whitespace-pre-wrap text-xs overflow-x-auto">
                              {testOutput[testCase.id]}
                            </pre>
                          ) : (
                            <p>Test failed with no error details</p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Expected: {JSON.stringify(testCase.expectedOutput)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestCaseRunner;
