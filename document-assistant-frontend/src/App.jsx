import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import QuestionForm from "./components/QuestionForm";
import AnswerDisplay from "./components/AnswerDisplay";
import { jsPDF } from "jspdf";

const App = () => {
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);

  const handleNewAnswer = (question, ans) => {
    setAnswer(ans);
    setHistory([{ question, answer: ans }, ...history]);
  };

  const copyHistory = () => {
    if (!history.length) return;
    const text = history
      .map((item, idx) => `Q${idx + 1}: ${item.question}\nA${idx + 1}: ${item.answer}`)
      .join("\n\n");
    navigator.clipboard.writeText(text)
      .then(() => alert("✅ Q&A history copied to clipboard!"))
      .catch(() => alert("⚠️ Failed to copy."));
  };

 const exportHistoryPDF = () => {
  if (!history.length) return;
  const doc = new jsPDF();
  let y = 10;

  history.forEach((item, idx) => {
    const questionText = `Q${idx + 1}: ${item.question}`;
    const answerText = `A${idx + 1}: ${item.answer}`;

    const splitQ = doc.splitTextToSize(questionText, 180);
    const splitA = doc.splitTextToSize(answerText, 180);

    doc.text(splitQ, 10, y);
    y += splitQ.length * 10;

    doc.text(splitA, 10, y);
    y += splitA.length * 10 + 5;

    if (y > 280) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("qa_history.pdf");
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex flex-col items-center p-4 sm:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-800 mb-2">
          📄 Study Assistant
        </h1>
        <p className="text-purple-600 sm:text-lg">
          Upload documents, ask questions, and get AI-powered answers instantly.
        </p>
      </header>

      <main className="w-full max-w-3xl flex flex-col gap-6 sm:gap-10">
        {/* Upload Form */}
        <UploadForm />

        {/* Question Form */}
        <QuestionForm
          setAnswer={(ans) =>
            handleNewAnswer(
              document.getElementById("questionInput")?.value || "",
              ans
            )
          }
        />

        {/* Answer Display */}
        <AnswerDisplay answer={answer} />

        {/* Q&A History */}
        <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-3 text-purple-800">🕘 Q&A History</h2>
          {history.length === 0 ? (
            <p className="text-purple-500">No previous questions yet.</p>
          ) : (
            <ul className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((item, index) => (
                <li
                  key={index}
                  className="bg-white rounded-xl p-3 border-l-4 border-pink-400 shadow-md hover:shadow-xl transition"
                >
                  <p className="font-medium text-purple-700">Q: {item.question}</p>
                  <p className="text-purple-600 mt-1">A: {item.answer}</p>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-4 mt-4 flex-wrap">
            <button
              onClick={copyHistory}
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
            >
              📋 Copy History
            </button>
            <button
              onClick={exportHistoryPDF}
              className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white px-5 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
            >
              📄 Export as PDF
            </button>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-purple-500 text-sm sm:text-base text-center">
        &copy; {new Date().getFullYear()} Document Assistant. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
