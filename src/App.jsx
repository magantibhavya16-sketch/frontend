import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [gesture, setGesture] = useState("Detecting...");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("http://localhost:5000/gesture");
      const data = await res.json();
      setGesture(data.gesture);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <h1>Hand Gesture Recognition</h1>

      <div className="camera-box">
        <img
          src="http://localhost:5000/video"
          alt="Gesture Stream"
        />
      </div>

      <div className="result">
        <span>Detected Gesture:</span>
        <h2>{gesture}</h2>
      </div>
    </div>
  );
}
