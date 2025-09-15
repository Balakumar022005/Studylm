import axios from "axios";

const API_URL = "http://localhost:5000";

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const askQuestion = async (question) => {
  return axios.post(`${API_URL}/ask`, { question });
};
