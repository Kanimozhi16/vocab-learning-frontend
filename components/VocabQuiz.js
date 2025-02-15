"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("https://vocab-backend.onrender.com"); // Replace with deployed backend URL

export default function VocabQuiz() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState([]);
  const [leaderboard, setLeaderboard] = useState({});
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchQuestion();
    socket.on("update_leaderboard", (data) => {
      setLeaderboard(data);
    });
    socket.on("receive_answer", (data) => {
      setResponses((prev) => [...prev, data]);
    });
  }, []);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get("https://vocab-backend.onrender.com/generate-question");
      setQuestion(res.data.question);
    } catch (err) {
      console.error("Error fetching question:", err);
    }
  };

  const submitAnswer = () => {
    if (!username) return alert("Enter your name first!");
    const isCorrect = Math.random() > 0.5; // Simulate AI checking (Replace with actual validation logic)
    socket.emit("send_answer", { user: username, answer, correct: isCorrect });
    setAnswer("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Vocabulary Quiz</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full my-2"
        />
      </div>

      <p className="font-semibold">{question || "Loading..."}</p>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Your answer"
        className="border p-2 w-full my-2"
      />
      <button onClick={submitAnswer} className="bg-blue-500 text-white px-4 py-2">
        Submit
      </button>

      <h3 className="mt-4 font-semibold">Responses</h3>
      <ul>
        {responses.map((resp, index) => (
          <li key={index} className="border-b p-2">{resp.user}: {resp.answer}</li>
        ))}
      </ul>

      <h3 className="mt-4 font-semibold">Leaderboard</h3>
      <ul>
        {Object.entries(leaderboard)
          .sort((a, b) => b[1] - a[1])
          .map(([player, score]) => (
            <li key={player} className="border-b p-2">{player}: {score} points</li>
          ))}
      </ul>
    </div>
  );
}
