import React, { useState } from "react";
import axios from "axios";

const QuestionForm = ({ setAnswer }) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question) return;
    setLoading(true);
    setAnswer(""); // clear previous answer

    try {
      const res = await axios.post("http://localhost:5000/ask", { question });
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer("❌ Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto mt-6 p-6 bg-gradient-to-br from-purple-50 via-purple-100 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-purple-700">Ask a Question</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Type your question..."
        className="w-full mb-4 p-2 rounded border focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      <button
        onClick={handleAsk}
        disabled={loading}
        className="w-full bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Fetching Answer..." : "Ask"}
      </button>
    </div>
  );
};

export default QuestionForm;
