
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Question, UserProgress } from "@/lib/types";
import { Clock, ArrowRight, CheckCircle, Clock8, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface QuestionCardProps {
  question: Question;
  userProgress?: UserProgress;
}

const QuestionCard = ({ question, userProgress }: QuestionCardProps) => {
  const isCompleted = userProgress?.completed || false;
  const timeSpent = userProgress?.timeSpentMs || 0;
  const hasStarted = !isCompleted && timeSpent > 0;
  const timeSpentMinutes = Math.ceil(timeSpent / 60000);
  const isOverTime = timeSpentMinutes > question.averageTimeMin;

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

  const getCardBorderClass = () => {
    if (isCompleted) return "border-green-300 border-2";
    if (hasStarted) return "border-yellow-300 border-2";
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={`overflow-hidden h-full ${getCardBorderClass()}`}>
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-medium line-clamp-2">{question.title}</h3>
            <Badge className={`${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-2">
          <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">
            {question.description.substring(0, 120)}...
          </p>
          <div className="flex flex-wrap gap-1 mt-3">
            {question.topics.slice(0, 3).map((topic) => (
              <Badge key={topic} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
            {question.topics.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{question.topics.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-4 pt-0 pb-4 flex justify-between items-center">
          <div className="flex items-center text-muted-foreground">
            {isCompleted ? (
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            ) : isOverTime && timeSpent > 0 ? (
              <Clock8 className="h-4 w-4 text-orange-500 mr-1" />
            ) : (
              <Clock className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm">
              {isCompleted ? (
                `Completed in ${timeSpentMinutes} min`
              ) : timeSpent > 0 ? (
                `In progress: ${timeSpentMinutes} min`
              ) : (
                `~${question.averageTimeMin} min`
              )}
            </span>
          </div>
          <Link 
            to={`/question/${question.id}`}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-3 ${
              hasStarted 
                ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {hasStarted ? (
              <>Resume <Play className="ml-1 h-4 w-4" /></>
            ) : (
              <>Solve <ArrowRight className="ml-1 h-4 w-4" /></>
            )}
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuestionCard;
