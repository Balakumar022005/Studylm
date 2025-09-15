import React from "react";

const AnswerDisplay = ({ answer }) => {
  return (
    <div className="max-w-xl w-full mx-auto mt-6 p-6 bg-gradient-to-br from-green-50 via-green-100 to-white rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-green-700 tracking-wide">
        Answer
      </h2>
      <p className="text-gray-800 text-base sm:text-lg leading-relaxed whitespace-pre-line">
        {answer || "Your answer will appear here."}
      </p>
      <div className="mt-4 text-right">
        <span className="text-sm text-gray-500 italic">Document Assistant</span>
      </div>
    </div>
  );
};

export default AnswerDisplay;
