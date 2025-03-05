import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { questions } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CodeEditor, { CollapsibleCode } from "@/components/CodeEditor";
import TestCaseRunner from "@/components/TestCaseRunner";
import HintCard from "@/components/HintCard";
import Timer from "@/components/Timer";
import { Check, Home, Play, SkipForward } from "lucide-react";
import { Question, UserProgress } from "@/lib/types";
import { getUserProgress, saveUserProgress, getAllUserProgress } from "@/lib/storage";
import { toast } from "sonner";
import React from "react";

// const importComponent = (questionId: string) => {
//   try {
//     // return lazy(() =>
//    return import(`../components/questions/${questionId}/index.tsx`)
//     // );
//   }
//   catch (error) {
//     console.error(`Error importing component for ${questionId}:`, error);
//     return null;
//   }
// };

const QuestionPage = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();

  const question = questions.find((q) => q.id === questionId);
  // const DynamicComponent = useMemo(() =>
  //   questionId ? importComponent(questionId) : null,
  //   [questionId]
  // );

  const DynamicComponent = useMemo(
    () => React.lazy(() =>
      import(`../components/questions/${questionId}/index.tsx`)
        .catch(() => {
          console.error(`Error loading component for ${questionId}`);
          return {
            default: () => <div className="p-6 border border-dashed rounded-md text-center">
              <p className="text-muted-foreground mb-2">Component not found</p>
              <p className="text-sm text-muted-foreground">
                Create <code>src/components/questions/{questionId}/index.tsx</code> to visualize your solution
              </p>
              <p className="text-sm text-muted-foreground">
                And paste this code in the editor:
              </p>
              <pre className="code-editor font-mono text-sm w-full min-h-[300px] 
                  p-4 bg-gray-50 border border-gray-200 rounded-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all duration-200 overflow-auto">
                <code>{code}</code>
              </pre>
            </div>
          };
        })
    ),
    [questionId] // Only recreate when questionId changes
  );

  const [code, setCode] = useState("");
  const [passedTests, setPassedTests] = useState<string[]>([]);
  const [timerRunning, setTimerRunning] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!question) {
      navigate("/");
      return;
    }

    setCode(question.starterCode);

    const savedProgress = getUserProgress(questionId) as UserProgress | null;
    if (savedProgress) {
      setProgress(savedProgress);
      setTimeSpent(savedProgress.timeSpentMs);
      setPassedTests(savedProgress.passedTestCases);
      setSubmitted(savedProgress.completed || false);
      if (savedProgress.completed) {
        setTimerRunning(false);
      }
    } else {
      setProgress({
        questionId: question.id,
        completed: false,
        timeSpentMs: 0,
        lastAttemptDate: new Date().toISOString(),
        passedTestCases: [],
      });
    }
  }, [question, questionId, navigate]);

  useEffect(() => {
    return () => {
      if (progress) {
        const updatedProgress: UserProgress = {
          ...progress,
          timeSpentMs: timeSpent,
          lastAttemptDate: new Date().toISOString(),
          passedTestCases: passedTests,
        };
        saveUserProgress(updatedProgress);
      }
    };
  }, [progress, timeSpent, passedTests]);

  const handleTimeUpdate = useCallback((newTimeMs: number) => {
    setTimeSpent(newTimeMs);

    if (progress && newTimeMs % 30000 < 1000) {
      const updatedProgress: UserProgress = {
        ...progress,
        timeSpentMs: newTimeMs,
        lastAttemptDate: new Date().toISOString(),
        passedTestCases: passedTests,
      };
      saveUserProgress(updatedProgress);
    }
  }, [progress, passedTests]);

  const toggleTimer = useCallback(() => {
    setTimerRunning(prev => !prev);
  }, []);

  const handleTestsCompleted = useCallback((passedIds: string[]) => {
    setPassedTests(passedIds);

    if (progress) {
      const updatedProgress: UserProgress = {
        ...progress,
        timeSpentMs: timeSpent,
        lastAttemptDate: new Date().toISOString(),
        passedTestCases: passedIds,
      };

      setProgress(updatedProgress);
      saveUserProgress(updatedProgress);
    }
  }, [progress, timeSpent]);

  const handleSubmit = useCallback(() => {
    setTimerRunning(false);
    setSubmitted(true);

    const allPassed = passedTests.length === question.testCases.length;

    if (allPassed) {
      const updatedProgress: UserProgress = {
        ...progress!,
        completed: true,
        timeSpentMs: timeSpent,
        lastAttemptDate: new Date().toISOString(),
        passedTestCases: passedTests,
      };

      setProgress(updatedProgress);
      saveUserProgress(updatedProgress);

      toast.success("All tests passed! Question completed!", {
        duration: 3000,
      });

      setTimeout(() => {
        const nextQuestion = getNextQuestion();
        if (nextQuestion) {
          navigate(`/question/${nextQuestion.id}`);
        } else {
          navigate("/");
        }
      }, 2000);
    } else {
      const updatedProgress: UserProgress = {
        ...progress!,
        timeSpentMs: timeSpent,
        lastAttemptDate: new Date().toISOString(),
        passedTestCases: passedTests,
      };

      setProgress(updatedProgress);
      saveUserProgress(updatedProgress);

      toast.error("Some tests are failing. Try again!", {
        duration: 3000,
      });
    }
  }, [progress, timeSpent, passedTests, question.testCases.length, navigate]);

  const handleSkip = useCallback(() => {
    if (progress) {
      const updatedProgress: UserProgress = {
        ...progress,
        timeSpentMs: timeSpent,
        lastAttemptDate: new Date().toISOString(),
        passedTestCases: passedTests,
      };
      saveUserProgress(updatedProgress);
    }

    const nextQuestion = getNextQuestion();
    if (nextQuestion) {
      navigate(`/question/${nextQuestion.id}`);
    } else {
      navigate("/");
    }
  }, [progress, timeSpent, passedTests, navigate]);

  const handleHome = useCallback(() => {
    if (progress) {
      const updatedProgress: UserProgress = {
        ...progress,
        timeSpentMs: timeSpent,
        lastAttemptDate: new Date().toISOString(),
        passedTestCases: passedTests,
      };
      saveUserProgress(updatedProgress);
      toast.success("Progress saved successfully!");
    }
    navigate("/");
  }, [progress, timeSpent, passedTests, navigate]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-difficulty-easy text-white";
      case "medium":
        return "bg-difficulty-medium text-black";
      case "hard":
        return "bg-difficulty-hard text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const isCompleted = progress?.completed || false;
  const timeSpentMinutes = Math.ceil(timeSpent / 60000);
  const isOverTime = timeSpentMinutes > question.averageTimeMin;

  const timerProps = useMemo(() => ({
    isRunning: timerRunning,
    onTimeUpdate: handleTimeUpdate,
    initialTimeMs: timeSpent,
    onToggleRunning: toggleTimer,
    averageTimeMin: question.averageTimeMin
  }), [timerRunning, handleTimeUpdate, timeSpent, toggleTimer, question.averageTimeMin]);

  const getNextQuestion = () => {
    const allProgress = getAllUserProgress();
    const completedIds = allProgress
      .filter(p => p.completed)
      .map(p => p.questionId);

    const nextQuestion = questions.find(q => !completedIds.includes(q.id) && q.id !== questionId);
    return nextQuestion || questions[0];
  };

  if (!question) {
    return null;
  }

  return (
    <div className="container py-6 px-4 mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Badge variant="outline">
                Question {questions.findIndex(q => q.id === questionId) + 1}/{questions.length}
              </Badge>
              <Badge className={getDifficultyColor(question.difficulty)}>
                {question.difficulty}
              </Badge>
            </div>
          </div>

          <Timer {...timerProps} />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{question.title}</h1>
          <div className="flex flex-wrap gap-1">
            {question.topics.map((topic) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        <CollapsibleCode title="Description" defaultOpen={true}>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{question.description}</p>
          </div>
        </CollapsibleCode>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="pt-6 h-full">

                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-muted-foreground">
                      Loading component...
                    </div>
                  </div>
                }>
                  <CodeEditor
                    value={code}
                    componentToRender={<DynamicComponent />}
                    readOnly={true}
                  />
                </Suspense>

              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <TestCaseRunner
              testCases={question.testCases}
              code={code}
              onTestsCompleted={handleTestsCompleted}
            />

            <HintCard hints={question.hints} />
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleHome}
            className="gap-1"
          >
            <Home className="h-4 w-4" />
            Save & Home
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="gap-1"
            >
              <SkipForward className="h-4 w-4" />
              Skip
            </Button>

            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={submitted || passedTests.length === 0}
              className="gap-1"
            >
              {isCompleted ? (
                <>
                  <Check className="h-4 w-4" />
                  Completed
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionPage;
