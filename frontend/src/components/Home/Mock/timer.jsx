import React, { useEffect, useState } from "react";
import { MdTimer } from "react-icons/md";

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Determine styles based on time left
  const isLastMinute = timeLeft < 60;
  const textColor = isLastMinute ? "text-red-600" : "text-gray-700";
  const timerBgColor = isLastMinute ? "bg-red-100 animate-pulse" : "bg-white";

  return (
    <div className={`flex items-center justify-center p-4 rounded-lg shadow-md ${timerBgColor}`}>
      <MdTimer className={`text-4xl ${isLastMinute ? "text-red-600" : "text-blue-500"}`} />
      <div className="ml-2">
        <p className={`text-3xl font-bold ${textColor}`}>{formatTime(timeLeft)}</p>
        
        {/* Progress Bar */}
        <div className="relative pt-2">
          <div className="overflow-hidden h-2 text-sm flex rounded bg-gray-200">
            <div
              style={{ width: `${(timeLeft / 600) * 100}%` }}
              className={`transition-all duration-1000 ease-in-out ${
                isLastMinute ? "bg-red-500" : "bg-blue-500"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
