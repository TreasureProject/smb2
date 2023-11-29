import { useEffect, useRef, useState } from "react";
import runningMp3 from "./running.mp3";
import errorMp3 from "./error.mp3";
import { NORMAL_TIME } from "./route";

// million-ignore
export const ReactorVideo = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [danger, setDanger] = useState(false);
  useEffect(() => {
    const updateCanvas = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!canvas || !video) return;

      const ctx = canvas.getContext("2d");

      if (!ctx || video.ended) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let l = frame.data.length / 4;

      for (let i = 0; i < l; i++) {
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        // const greenTolerance = 40;
        // if (
        //   g > 85.7 - greenTolerance &&
        //   g < 85.7 + greenTolerance &&
        //   r < 45 &&
        //   b < 45
        // ) {
        //   frame.data[i * 4 + 3] = 0;
        // }
        // make a white pixel transparent
        if (r > 240 && g > 240 && b > 240) {
          frame.data[i * 4 + 3] = 0;
        }
      }

      ctx.putImageData(frame, 0, 0);
      requestAnimationFrame(updateCanvas);
    };

    requestAnimationFrame(updateCanvas);
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0.01;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = danger ? NORMAL_TIME + 1 : 0;
  }, [danger]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const running = new Audio(runningMp3);
    const error = new Audio(errorMp3);

    // check if the video is playing
    if (video.paused) {
      running.pause();
      error.pause();
    }

    if (danger) {
      error.play();
      running.pause();
    } else {
      running.play();
      error.pause();
    }
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          if (playing) {
            videoRef.current?.pause();
          } else {
            videoRef.current?.play();
          }
        }}
      >
        PLAY
      </button>
      <button
        className="text-white font-mono"
        onClick={() => {
          setDanger(!danger);
        }}
      >
        DANGER
      </button>
      <video
        onTimeUpdate={() => {
          const video = videoRef.current;
          if (!video) return;
          const duration = video.duration;
          if (danger) {
            if (video.currentTime > duration - 0.1) {
              video.currentTime = NORMAL_TIME + 1;
            }
          } else if (!danger && video.currentTime > NORMAL_TIME) {
            video.currentTime = 0;
          }
        }}
        onPlay={() => {
          console.log("play");
          setPlaying(true);
        }}
        onPause={() => {
          setPlaying(false);
        }}
        ref={videoRef}
        src={src}
        crossOrigin="anonymous"
        className="hidden"
        playsInline
        loop
      />
      <div className="relative inline-block overflow-hidden">
        <canvas ref={canvasRef} className="h-full" />
      </div>
    </div>
  );
};
