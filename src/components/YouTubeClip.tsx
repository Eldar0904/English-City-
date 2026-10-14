import { useEffect, useRef, useState } from "react";
import YouTube, { type YouTubeEvent, type YouTubePlayer } from "react-youtube";
import { Pause, Play, RotateCcw } from "lucide-react";

export default function YouTubeClip({
  start,
  end,
  label,
  compact = false,
}: {
  start: number;
  end: number;
  label: string;
  compact?: boolean;
}) {
  const player = useRef<YouTubePlayer | null>(null);
  const timer = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [plays, setPlays] = useState(0);
  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current);
    },
    [],
  );
  function clearTimer() {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
  }
  function onReady(event: YouTubeEvent) {
    player.current = event.target;
    player.current.seekTo(start, true);
    setReady(true);
  }
  function pause() {
    player.current?.pauseVideo();
    setPlaying(false);
    clearTimer();
  }
  function play() {
    if (!player.current) return;
    clearTimer();
    player.current.seekTo(start, true);
    player.current.setPlaybackRate(speed);
    player.current.playVideo();
    setPlaying(true);
    setPlays((value) => value + 1);
    timer.current = window.setInterval(async () => {
      const current = await player.current?.getCurrentTime();
      if (typeof current === "number" && current >= end) pause();
    }, 180);
  }
  return (
    <div className={compact ? "youtube-clip compact" : "youtube-clip"}>
      <div className="clip-frame">
        <YouTube
          videoId="UNP03fDSj1U"
          onReady={onReady}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              start,
              end,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
              cc_load_policy: 1,
              origin: window.location.origin,
            },
          }}
        />
      </div>
      <div className="clip-strip">
        <div>
          <span>YOUTUBE CLIP</span>
          <b>{label}</b>
          <small>
            {Math.floor(start / 60)}:{String(start % 60).padStart(2, "0")}–
            {Math.floor(end / 60)}:{String(end % 60).padStart(2, "0")}
          </small>
        </div>
        <button disabled={!ready} onClick={playing ? pause : play}>
          {playing ? <Pause /> : plays ? <RotateCcw /> : <Play />}
          {playing ? "Pause" : plays ? "Replay" : "Play"}
        </button>
        <label>
          Speed
          <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>
            <option value="0.75">0.75×</option>
            <option value="1">1×</option>
          </select>
        </label>
      </div>
    </div>
  );
}
