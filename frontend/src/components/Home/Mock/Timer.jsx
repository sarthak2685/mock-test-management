import React, { useEffect, useState } from "react";

const Timer = ({ totalMinutes = 10, onTimeUp }) => {
  // Set initial timeLeft based on totalMinutes received from API
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60);
  const warningTime = 5 * 60; // 5 minutes in seconds

  // Update timeLeft dynamically if totalMinutes changes
  useEffect(() => {
    const totalTime = totalMinutes > 0 ? totalMinutes * 60 : 60; // Default to 1 minute if invalid
    setTimeLeft(totalTime);
  }, [totalMinutes]);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerId); // Clear interval on unmount
    } else if (timeLeft === 0 && onTimeUp) {
      onTimeUp(); // Trigger the onTimeUp callback
    }
  }, [timeLeft, onTimeUp]);

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? `0${sec}` : sec}`;
  };

  // Determine styles and progress
  const isLastMinute = timeLeft < 60;
  const progressPercentage = (timeLeft / (totalMinutes * 60)) * 100;
  const textColor = isLastMinute ? "text-red-600" : "text-gray-700";
  const timerBgColor = isLastMinute ? "bg-red-100 animate-pulse" : "bg-white";

  return (
    <div className="flex flex-col items-center">
      {/* Circular Progress Bar */}
      <div
        className="relative w-16 h-16 flex items-center justify-center"
        style={{
          background: `conic-gradient(${
            isLastMinute ? "#ef4444" : "#007bff"
          } ${progressPercentage}%, #e6e6e6 ${progressPercentage}%)`,
          borderRadius: "50%",
        }}
      >
        {/* Inner timer display */}
        <div className="absolute w-12 h-12 bg-white flex items-center justify-center rounded-full text-black font-bold">
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Timer with icon (Optional, commented out) */}
      {/* <div className="flex items-center mt-4">
        <MdTimer
          className={`text-4xl ${
            isLastMinute ? "text-red-600" : "text-blue-500"
          }`}
        />
        <p
          className={`ml-2 text-3xl font-bold ${textColor} ${
            isLastMinute ? "animate-pulse" : ""
          }`}
        >
          {formatTime(timeLeft)}
        </p>
      </div> */}
    </div>
  );
};

export default Timer;
