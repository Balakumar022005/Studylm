import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return setStatus("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Uploading...");
      setProgress(0);

      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          }
        },
      });

      // ✅ Use message from backend instead of res.data.chunks
      setStatus(res.data.message || "✅ File uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setStatus("❌ Upload failed");
      setProgress(0);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto mt-6 p-6 bg-gradient-to-br from-blue-50 via-blue-100 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-blue-700">
        Upload Document
      </h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full mb-4 text-gray-700 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        Upload
      </button>

      {progress > 0 && (
        <div className="mt-4 w-full bg-gray-200 rounded h-3">
          <div
            className="bg-blue-500 h-3 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {status && <p className="mt-3 text-center text-gray-800">{status}</p>}
    </div>
  );
};

export default UploadForm;
