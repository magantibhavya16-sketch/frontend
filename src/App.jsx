import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [gesture, setGesture] = useState("Detecting...");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("https://backend-2-p080.onrender.com/gesture");
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
          src="http://https://backend-2-p080.onrender.com/video"
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
