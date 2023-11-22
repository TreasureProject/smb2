import { useEffect, useRef, useState } from "react";
import smol_brian from "./smol_brian.mp4";
import Tv from "./tv.png";
import { motion, useAnimate } from "framer-motion";
import "./reactor.css";
import { commonMeta } from "~/seo";
import { Header } from "~/components/Header";

export const meta = commonMeta;

// million-ignore
const GreenScreenVideo = ({ src }: { src: string }) => {
  const [scope, animate] = useAnimate();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const updateCanvas = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!canvas || !video) return;

      const ctx = canvas.getContext("2d");

      if (!ctx || video.paused || video.ended) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let l = frame.data.length / 4;

      for (let i = 0; i < l; i++) {
        let r = frame.data[i * 4 + 0];
        let g = frame.data[i * 4 + 1];
        let b = frame.data[i * 4 + 2];
        const greenTolerance = 40;
        if (
          g > 85.7 - greenTolerance &&
          g < 85.7 + greenTolerance &&
          r < 45 &&
          b < 45
        ) {
          frame.data[i * 4 + 3] = 0;
        }
      }

      ctx.putImageData(frame, 0, 0);
      requestAnimationFrame(updateCanvas);
    };

    if (playing) {
      requestAnimationFrame(updateCanvas);
    }
  }, [playing]);

  useEffect(() => {
    const animation = async () => {
      await animate(
        scope.current,
        {
          y: [-1500, 0]
        },
        {
          duration: 0.3,
          ease: "linear"
        }
      );

      await animate(
        scope.current,
        {
          rotate: [12, 0, -4, 0],
          transformOrigin: ["0% 100%", "100% 100%"]
        },
        {
          duration: 0.1,
          ease: "linear"
        }
      );
    };

    animation();
  }, [animate, scope]);

  return (
    <div>
      <video
        onPlay={() => {
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
      />

      <motion.div
        initial={{
          rotate: 12,
          transformOrigin: "0% 100%",
          y: -1500
        }}
        ref={scope}
        className="relative inline-block w-80 sm:w-[40rem]"
      >
        <button
          className="absolute inset-0 z-30 aspect-square"
          onClick={() => {
            if (playing) {
              videoRef.current?.pause();
            } else {
              videoRef.current?.play();
            }
          }}
        ></button>
        <img src={Tv} className="relative z-20 h-full w-full" />
        <div className="crt absolute bottom-[22.2%] left-[-20%] z-10 h-[47%] w-[110%] ">
          <canvas ref={canvasRef} className="h-full" />
        </div>
      </motion.div>
    </div>
  );
};

export default function Reactor() {
  return (
    <div className="flex h-full min-h-full flex-col">
      <Header name="Reactor" />
      <div className="grid flex-1 place-items-center">
        <GreenScreenVideo src={smol_brian} />
      </div>
    </div>
  );
}
