"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function VocabQuiz() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetchQuestion();
    socket.on("receive_answer", (data) => {
      setResponses((prev) => [...prev, data]);
    });
  }, []);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get("http://localhost:5000/generate-question");
      setQuestion(res.data.question);
    } catch (err) {
      console.error("Error fetching question:", err);
    }
  };

  const submitAnswer = () => {
    socket.emit("send_answer", { user: "Student", answer });
    setAnswer("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Vocabulary Quiz</h2>
      <p>{question || "Loading..."}</p>
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
    </div>
  );
}
