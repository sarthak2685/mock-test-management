import React, { useEffect, useState } from 'react';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <h3 className="font-bold text-gray-700">Time Remaining</h3>
      <p className="text-xl font-semibold">
        {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
      </p>
    </div>
  );
};

export default Timer;
