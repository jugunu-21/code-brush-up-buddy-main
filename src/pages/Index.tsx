
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { questions } from "@/data/questions";
import QuestionCard from "@/components/QuestionCard";
import QuestionFilters from "@/components/QuestionFilters";
import { Difficulty, Question, Topic, UserProgress } from "@/lib/types";
import { getAllUserProgress } from "@/lib/storage";

const Index = () => {
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(questions);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  
  // Get all unique topics from questions
  const allTopics = Array.from(
    new Set(questions.flatMap((q) => q.topics))
  ) as Topic[];

  useEffect(() => {
    // Load user progress from local storage
    const progress = getAllUserProgress();
    setUserProgress(progress);
  }, []);

  const handleFilterChange = ({
    difficulties,
    topics,
    sortOrder,
    showCompleted,
  }: {
    difficulties: Difficulty[];
    topics: Topic[];
    sortOrder: "asc" | "desc" | "none";
    showCompleted: boolean;
  }) => {
    let filtered = [...questions];

    // Filter by difficulty
    if (difficulties.length > 0) {
      filtered = filtered.filter((q) => difficulties.includes(q.difficulty));
    }

    // Filter by topics
    if (topics.length > 0) {
      filtered = filtered.filter((q) =>
        q.topics.some((t) => topics.includes(t))
      );
    }

    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter(
        (q) => !userProgress.some((p) => p.questionId === q.id && p.completed)
      );
    }

    // Sort by time
    if (sortOrder !== "none") {
      filtered.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.averageTimeMin - b.averageTimeMin;
        } else {
          return b.averageTimeMin - a.averageTimeMin;
        }
      });
    }

    setFilteredQuestions(filtered);
  };

  // Calculate progress stats
  const totalQuestions = questions.length;
  const completedQuestions = userProgress.filter(p => p.completed).length;
  const completionPercentage = Math.round((completedQuestions / totalQuestions) * 100) || 0;

  return (
    <div className="container py-8 px-4 mx-auto max-w-6xl">
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">React Code Brush-Up Buddy</h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
          Practice essential React concepts with interactive coding challenges
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <div className="bg-primary/10 rounded-lg px-5 py-2 text-center">
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="text-2xl font-semibold">{totalQuestions}</p>
          </div>
          
          <div className="bg-primary/10 rounded-lg px-5 py-2 text-center">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-semibold">{completedQuestions}</p>
          </div>
          
          <div className="bg-primary/10 rounded-lg px-5 py-2 text-center">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-2xl font-semibold">{completionPercentage}%</p>
          </div>
        </div>
      </motion.div>

      <QuestionFilters 
        onFilterChange={handleFilterChange} 
        availableTopics={allTopics}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            userProgress={userProgress.find(
              (p) => p.questionId === question.id
            )}
          />
        ))}

        {filteredQuestions.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium mb-2">No questions match your filters</h3>
            <p className="text-muted-foreground">Try adjusting your filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
