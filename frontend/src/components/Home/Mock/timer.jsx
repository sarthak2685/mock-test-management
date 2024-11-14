import React, { useEffect, useState } from "react";
import { MdTimer } from "react-icons/md";

const Timer = ({ initialTime = 600, onTimeUp }) => { // Add onTimeUp prop for automatic submission
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(timer);
        if (onTimeUp) onTimeUp(); // Trigger onTimeUp callback when time is up
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, [onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Determine styles and messages based on time left
  const isLastMinute = timeLeft < 60;
  const textColor = isLastMinute ? "text-red-600" : "text-gray-700";
  const timerBgColor = isLastMinute ? "bg-red-100 animate-pulse" : "bg-white";

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${timerBgColor} `}>
      <div className="flex items-center">
        <MdTimer className={`text-4xl ${isLastMinute ? "text-red-600" : "text-blue-500"}`} />
        <p className={`ml-2 text-3xl font-bold ${textColor} ${isLastMinute ? "animate-pulse" : ""}`}>
          {formatTime(timeLeft)}
        </p>
      </div>
    </div>
  );
};

export default Timer;
