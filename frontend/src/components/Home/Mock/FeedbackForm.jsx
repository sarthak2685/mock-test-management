import React, { useState } from "react";

const FeedbackForm = ({ onSubmitFeedback }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    onSubmitFeedback(feedback);
    setFeedback("");
  };

  return (
    <div className="text-center mt-6">
      <h3 className="text-xl font-bold text-blue-600">
        We value your feedback!
      </h3>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-2 mt-4 border rounded-lg"
        placeholder="Please share your feedback here..."
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackForm;
