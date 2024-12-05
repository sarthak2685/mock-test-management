import React, { useEffect, useState } from "react";

const Timer = ({ totalMinutes = 10, onTimeUp }) => {
  // Set initial timeLeft based on totalMinutes received from API
  const [timeLeft, setTimeLeft] = useState(totalMinutes * 60);

  // Save totalMinutes to localStorage on component mount
  //   useEffect(() => {
  //     localStorage.setItem("totalMinutes", totalMinutes);
  //     console.log("Time 1", totalMinutes);
  //   }, [totalMinutes]);

  // Timer countdown logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerId); // Clear interval on unmount
    } else if (timeLeft === 0 && onTimeUp) {
      onTimeUp(); // Trigger the onTimeUp callback when the time reaches 0
    }
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? `0${sec}` : sec}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-16 h-16 flex items-center justify-center"
        style={{
          background: `conic-gradient(${
            timeLeft < 60 ? "#ef4444" : "#007bff"
          } ${(timeLeft / (totalMinutes * 60)) * 100}%, #e6e6e6 ${
            (timeLeft / (totalMinutes * 60)) * 100
          }%)`,
          borderRadius: "50%",
        }}
      >
        <div className="absolute w-12 h-12 bg-white flex items-center justify-center rounded-full text-black font-bold">
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
