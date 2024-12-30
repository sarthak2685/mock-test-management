import React, { useState, useEffect } from "react";

const Timer = () => {
    const totalTime = 60 * 60;
    const [timeLeft, setTimeLeft] = useState(totalTime);
    const warningTime = 5 * 60;

    useEffect(() => {
      if (timeLeft > 0) {
        const timerId = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
      }
    }, [timeLeft]);

    const formatTime = (totalSeconds) => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const percentage = (timeLeft / totalTime) * 100;
    const progressColor = timeLeft > warningTime ? "#007bff" : "#ef4444";

    return (
      <div
        className="relative w-16 h-16 flex items-center justify-center"
        style={{
          background: `conic-gradient(${progressColor} ${percentage}%, #e6e6e6 ${percentage}%)`,
          borderRadius: "50%",
        }}
      >
        <div className="absolute w-12 h-12 bg-white flex items-center justify-center rounded-full text-black font-bold">
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>
    );
  };

export default Timer