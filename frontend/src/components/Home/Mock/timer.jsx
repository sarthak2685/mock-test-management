// Timer.js
import React, { useEffect, useState } from "react";

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

  return (
    <div
      className={`bg-white rounded-md shadow-md p-4 text-center mb-6 ${
        timeLeft < 60 ? "bg-red-500 text-white" : ""
      }`}
    >
      <h3 className="font-bold text-gray-700">Time Remaining</h3>
      <p className="text-2xl font-semibold">{formatTime(timeLeft)}</p>
    </div>
  );
};

export default Timer;
