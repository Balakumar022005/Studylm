import express from "express";
import { spawn } from "child_process";

const router = express.Router();

router.post("/ask", (req, res) => {
  const userQuery = req.body.query;

  if (!userQuery || userQuery.trim() === "") {
    return res.status(400).json({ error: "Query is required" });
  }

  const pythonProcess = spawn("python", ["D:/new123/rag_llm_bin.py", userQuery]);

  let result = "";
  let errorOutput = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString("utf-8");
  });

  pythonProcess.stderr.on("data", (data) => {
    errorOutput += data.toString("utf-8");
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`Python exited with code ${code}: ${errorOutput}`);
      return res.status(500).json({ error: "Python script failed", details: errorOutput });
    }

    try {
      const parsed = JSON.parse(result.trim());
      res.json(parsed);
    } catch (err) {
      res.status(500).json({ error: "Invalid response from Python", raw: result });
    }
  });
});

export default router;
