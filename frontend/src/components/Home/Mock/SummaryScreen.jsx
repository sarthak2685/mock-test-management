import React from "react";

const SummaryScreen = ({
  answeredQuestions,
  markedForReview,
  questions,
  onSubmit,
  onReturn,
}) => (
  <div className="text-center">
    <h2 className="text-2xl font-bold text-blue-600">Review Your Answers</h2>
    <p className="mt-4">
      Questions Answered: {answeredQuestions.filter(Boolean).length}
    </p>
    <p>Marked for Review: {markedForReview.length}</p>
    <p>
      Unanswered Questions:{" "}
      {questions.length - answeredQuestions.filter(Boolean).length}
    </p>
    <div className="mt-4 flex space-x-4 justify-center">
      <button
        onClick={onSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        Submit
      </button>
      <button
        onClick={onReturn}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Go Back
      </button>
    </div>
  </div>
);

export default SummaryScreen;
