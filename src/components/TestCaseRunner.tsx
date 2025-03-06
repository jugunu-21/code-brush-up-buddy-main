
import { useState } from "react";
import { TestCase } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TestCaseRunnerProps {
  testCases: TestCase[];
  code: string;
  onTestsCompleted: (passedIds: string[]) => void;
}

const TestCaseRunner = ({ testCases, code, onTestsCompleted }: TestCaseRunnerProps) => {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [running, setRunning] = useState(false);

  const runTests = () => {
    setRunning(true);
    const newResults: Record<string, boolean> = {};

    setTimeout(() => {
      testCases.forEach((testCase) => {
        try {
          // Actually run the test function on the code
          const result = testCase.testFunction(code);
          newResults[testCase.id] = result;
        } catch (error) {
          console.error(`Test case ${testCase.id} failed with error:`, error);
          newResults[testCase.id] = false;
        }
      });

      setResults(newResults);
      setRunning(false);

      const passedIds = Object.entries(newResults)
        .filter(([_, passed]) => passed)
        .map(([id]) => id);

      onTestsCompleted(passedIds);
    }, 1000);
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
          <Play className="h-4 w-4" />
          Run Tests
        </Button>
      </div>

      {Object.keys(results).length > 0 && (
        <Alert className={allPassed ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
          <AlertDescription>
            {allPassed
              ? `All tests passed! (${passedCount}/${totalTests})`
              : `${passedCount}/${totalTests} tests passing`}
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
                  <div>
                    <p className="font-medium">{testCase.description}</p>
                    {isRun && !isPassed && (
                      <p className="text-sm text-red-600 mt-1">
                        Expected: {JSON.stringify(testCase.expectedOutput)}
                      </p>
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
