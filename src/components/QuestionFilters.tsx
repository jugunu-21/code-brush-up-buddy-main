
import { useState } from "react";
import { Difficulty, Topic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Filter, SortAsc, SortDesc } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface QuestionFiltersProps {
  onFilterChange: (filters: {
    difficulties: Difficulty[];
    topics: Topic[];
    sortOrder: "asc" | "desc" | "none";
    showCompleted: boolean;
  }) => void;
  availableTopics: Topic[];
}

const QuestionFilters = ({ onFilterChange, availableTopics }: QuestionFiltersProps) => {
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [showCompleted, setShowCompleted] = useState(true);

  const handleDifficultyToggle = (difficulty: Difficulty) => {
    setDifficulties((prev) => {
      const newDifficulties = prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty];
      
      onFilterChange({
        difficulties: newDifficulties,
        topics,
        sortOrder,
        showCompleted,
      });
      
      return newDifficulties;
    });
  };

  const handleTopicToggle = (topic: Topic) => {
    setTopics((prev) => {
      const newTopics = prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic];
      
      onFilterChange({
        difficulties,
        topics: newTopics,
        sortOrder,
        showCompleted,
      });
      
      return newTopics;
    });
  };

  const handleSortChange = (order: "asc" | "desc" | "none") => {
    setSortOrder(order);
    onFilterChange({
      difficulties,
      topics,
      sortOrder: order,
      showCompleted,
    });
  };

  const handleCompletedToggle = () => {
    setShowCompleted((prev) => {
      onFilterChange({
        difficulties,
        topics,
        sortOrder,
        showCompleted: !prev,
      });
      return !prev;
    });
  };

  const handleReset = () => {
    setDifficulties([]);
    setTopics([]);
    setSortOrder("none");
    setShowCompleted(true);
    onFilterChange({
      difficulties: [],
      topics: [],
      sortOrder: "none",
      showCompleted: true,
    });
  };

  return (
    <motion.div 
      className="flex flex-wrap gap-2 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Difficulty
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by Difficulty</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={difficulties.includes("easy")}
            onCheckedChange={() => handleDifficultyToggle("easy")}
          >
            Easy
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={difficulties.includes("medium")}
            onCheckedChange={() => handleDifficultyToggle("medium")}
          >
            Medium
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={difficulties.includes("hard")}
            onCheckedChange={() => handleDifficultyToggle("hard")}
          >
            Hard
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Topics
            <ChevronDown className="h-4 w-4 ml-1" />
            {topics.length > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {topics.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Topic</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-[300px] overflow-y-auto">
            {availableTopics.map((topic) => (
              <DropdownMenuCheckboxItem
                key={topic}
                checked={topics.includes(topic)}
                onCheckedChange={() => handleTopicToggle(topic)}
              >
                {topic}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1">
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : sortOrder === "desc" ? (
              <SortDesc className="h-4 w-4" />
            ) : (
              <Filter className="h-4 w-4" />
            )}
            Sort by Time
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Sort by Time</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={sortOrder === "asc"}
            onCheckedChange={() => handleSortChange(sortOrder === "asc" ? "none" : "asc")}
          >
            Shortest First
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sortOrder === "desc"}
            onCheckedChange={() => handleSortChange(sortOrder === "desc" ? "none" : "desc")}
          >
            Longest First
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        className="gap-1"
        onClick={handleCompletedToggle}
      >
        <Check className="h-4 w-4" />
        {showCompleted ? "Hide Completed" : "Show Completed"}
      </Button>

      {(difficulties.length > 0 || topics.length > 0 || sortOrder !== "none" || !showCompleted) && (
        <Button variant="ghost" onClick={handleReset}>
          Reset Filters
        </Button>
      )}
    </motion.div>
  );
};

export default QuestionFilters;
