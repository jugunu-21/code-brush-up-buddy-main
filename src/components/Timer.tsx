import { useEffect, useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Pause, Play, RotateCcw } from "lucide-react";

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate: (timeMs: number) => void;
  initialTimeMs?: number;
  onToggleRunning: () => void;
  averageTimeMin?: number; // Added average time for countdown
}

const Timer = memo(({
  isRunning,
  onTimeUpdate,
  initialTimeMs = 0,
  onToggleRunning,
  averageTimeMin = 0
}: TimerProps) => {
  const [elapsedTimeMs, setElapsedTimeMs] = useState(initialTimeMs);
  const [startTime, setStartTime] = useState<number | null>(null);
  const averageTimeMs = averageTimeMin * 60 * 1000;

  // Check if we've exceeded the average time
  const isOverTime = averageTimeMs > 0 && elapsedTimeMs > averageTimeMs;

  const updateTime = useCallback(() => {
    const newElapsedTime = Date.now() - (startTime || Date.now());
    setElapsedTimeMs(newElapsedTime);
    onTimeUpdate(newElapsedTime);
  }, [startTime, onTimeUpdate]);

  useEffect(() => {
    let interval: number;

    if (isRunning) {
      // Set the start time if it's not already set
      if (startTime === null) {
        setStartTime(Date.now() - elapsedTimeMs);
      }

      interval = window.setInterval(updateTime, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime, updateTime]);

  const resetTimer = useCallback(() => {
    setElapsedTimeMs(0);
    setStartTime(null);
    onTimeUpdate(0);
  }, [onTimeUpdate]);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const formatRemainingTime = useCallback((elapsedMs: number, totalMs: number) => {
    if (totalMs === 0) return formatTime(elapsedMs);

    const remainingMs = totalMs - elapsedMs;
    if (remainingMs >= 0) {
      // Still within time limit
      const totalSeconds = Math.floor(remainingMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      // Over time limit
      const overTimeMs = Math.abs(remainingMs);
      const totalSeconds = Math.floor(overTimeMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `-${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }, [formatTime]);

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center px-3 py-1.5 rounded-md ${isOverTime ? 'bg-red-100' : 'bg-primary/10'
        }`}>
        <Clock className={`h-4 w-4 mr-2 ${isOverTime ? 'text-red-500' : 'text-primary'}`} />
        <span className={`font-mono text-lg ${isOverTime ? 'text-red-700' : 'text-primary-foreground'}`}>
          {averageTimeMs > 0
            ? formatRemainingTime(elapsedTimeMs, averageTimeMs)
            : formatTime(elapsedTimeMs)
          }
        </span>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={onToggleRunning}
        className="h-8 px-2"
      >
        {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={resetTimer}
        className="h-8 px-2"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
});

Timer.displayName = "Timer";

export default Timer;
