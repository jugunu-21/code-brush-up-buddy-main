
import { useState } from "react";
import { Hint } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface HintCardProps {
  hints: Hint[];
}

const HintCard = ({ hints }: HintCardProps) => {
  const [revealedHints, setRevealedHints] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleHint = (hintId: string) => {
    setRevealedHints((prev) =>
      prev.includes(hintId)
        ? prev.filter((id) => id !== hintId)
        : [...prev, hintId]
    );
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card>
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between cursor-pointer" onClick={toggleExpand}>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="font-medium">Hints</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0 pb-3 px-4">
              <p className="text-sm text-muted-foreground mb-3">
                Use hints only if you're stuck. Each revealed hint may affect your completion time analysis.
              </p>
              
              <div className="space-y-2">
                {hints.map((hint, index) => (
                  <div key={hint.id} className="border rounded-md">
                    <div 
                      className="flex justify-between items-center p-3 cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleHint(hint.id)}
                    >
                      <span className="font-medium">Hint {index + 1}</span>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        {revealedHints.includes(hint.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {revealedHints.includes(hint.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-3 pb-3"
                        >
                          <p className="text-sm">{hint.text}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default HintCard;
