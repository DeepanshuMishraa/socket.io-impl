import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamIntervalRef = useRef<number>();

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // Handle receiving streams from other clients
    socket.on("stream", (imageData: string) => {
      const img = new Image();
      img.onload = () => {
        const context = canvasRef.current?.getContext("2d");
        if (context && canvasRef.current) {
          context.drawImage(
            img,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      };
      img.src = imageData;
    });

    const constraints = {
      video: {
        width: 640,
        height: 480,
        frameRate: { ideal: 10, max: 15 },
      },
    };

    const startStreaming = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        const captureAndSendFrame = () => {
          if (context && videoRef.current && canvas) {
            context.drawImage(
              videoRef.current,
              0,
              0,
              canvas.width,
              canvas.height
);

            // Convert to base64 and emit
            // Using a lower quality to reduce data size
            const imageData = canvas.toDataURL("image/jpeg", 0.5);
            socket.emit("stream", imageData);
          }
        };

        // Capture frames at 10 FPS
        streamIntervalRef.current = window.setInterval(
          captureAndSendFrame,
          100
        );
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startStreaming();

    // Cleanup function
    return () => {
      // Clear interval
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }

      // Stop all tracks
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }

      // Disconnect socket
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-xl font-bold">Video Stream</h1>
      <div className="relative">
        {/* Local video preview */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full max-w-xl rounded-lg shadow-lg"
        />
        {/* Canvas for receiving remote streams */}
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          className="w-full max-w-xl mt-4 rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

