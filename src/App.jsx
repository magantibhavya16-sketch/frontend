import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import "./App.css";

const BACKEND_URL = "https://backend-2-p080.onrender.com";

export default function App() {
  const videoRef = useRef(null);
  const [gesture, setGesture] = useState("No Hand");

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults(async (results) => {
      if (!results.multiHandLandmarks) {
        setGesture("No Hand");
        return;
      }

      let data = [];

      results.multiHandLandmarks.slice(0, 2).forEach((hand) => {
        hand.forEach((lm) => {
          data.push(lm.x, lm.y, lm.z);
        });
      });

      while (data.length < 126) {
        data.push(0, 0, 0);
      }

      const res = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landmarks: data }),
      });

      const json = await res.json();
      setGesture(json.gesture);
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();
  }, []);

  return (
    <div className="app">
      <h1 className="title">Hand Gesture Recognition</h1>

      <video ref={videoRef} autoPlay playsInline className="camera" />

      <div className="result">
        <span>Detected Gesture</span>
        <h2>{gesture}</h2>
      </div>
    </div>
  );
}
