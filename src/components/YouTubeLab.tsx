import { useEffect, useRef, useState } from "react";
import YouTube, { type YouTubeEvent, type YouTubePlayer } from "react-youtube";
import {
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";

type Segment = {
  id: string;
  title: string;
  start: number;
  end: number;
  focus: string;
  phrase: string;
  stress: string;
  kk: string;
};

const segments: Segment[] = [
  {
    id: "idea",
    title: "The 30-day idea",
    start: 16,
    end: 37,
    focus: "Gist",
    phrase: "I decided to try something new for 30 days.",
    stress: "I deCIDed to try something NEW for thirty DAYS.",
    kk: "Мен 30 күн бойы жаңа нәрсе жасап көруге шешім қабылдадым.",
  },
  {
    id: "confidence",
    title: "Confidence grows",
    start: 63,
    end: 86,
    focus: "Cause & effect",
    phrase: "As I started to do harder challenges, my self-confidence grew.",
    stress: "As I STARted to do HARDer challenges, my self-CONfidence GREW.",
    kk: "Күрделірек сынақтарды бастаған сайын, өзіме деген сенімім артты.",
  },
  {
    id: "changes",
    title: "Changes that stick",
    start: 153,
    end: 174,
    focus: "Key detail",
    phrase: "Small, sustainable changes were more likely to stick.",
    stress: "SMALL, susTAINable CHANGes were more likely to STICK.",
    kk: "Кішкентай, тұрақты өзгерістерді жалғастыру оңайырақ болды.",
  },
  {
    id: "challenge",
    title: "Give it a shot",
    start: 174,
    end: 191,
    focus: "Invitation",
    phrase:
      "Why not think about something you have always wanted to try and give it a shot?",
    stress:
      "WHY not think about something you've always WANted to TRY and GIVE it a SHOT?",
    kk: "Көптен бері байқап көргіңіз келген нәрсеге неге кіріспеске?",
  },
];

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function YouTubeLab({ kk }: { kk: boolean }) {
  const player = useRef<YouTubePlayer | null>(null);
  const stopTimer = useRef<number | null>(null);
  const [active, setActive] = useState(segments[0]);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [phraseVisible, setPhraseVisible] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [speed, setSpeed] = useState(1);

  useEffect(
    () => () => {
      if (stopTimer.current) window.clearInterval(stopTimer.current);
    },
    [],
  );

  function onReady(event: YouTubeEvent) {
    player.current = event.target;
    setReady(true);
  }

  function clearTimer() {
    if (stopTimer.current) window.clearInterval(stopTimer.current);
    stopTimer.current = null;
  }

  function playSegment(segment = active, rate = speed) {
    if (!player.current) return;
    clearTimer();
    setActive(segment);
    setPlaying(true);
    setPhraseVisible(false);
    setAttempts((value) => ({
      ...value,
      [segment.id]: (value[segment.id] || 0) + 1,
    }));
    player.current.seekTo(segment.start, true);
    player.current.setPlaybackRate(rate);
    player.current.playVideo();
    stopTimer.current = window.setInterval(async () => {
      const current = await player.current?.getCurrentTime();
      if (typeof current === "number" && current >= segment.end) {
        player.current?.pauseVideo();
        setPlaying(false);
        clearTimer();
      }
    }, 200);
  }

  function pause() {
    player.current?.pauseVideo();
    setPlaying(false);
    clearTimer();
  }

  function selectSegment(segment: Segment) {
    pause();
    setActive(segment);
    setPhraseVisible(false);
    player.current?.seekTo(segment.start, true);
  }

  return (
    <section className="youtube-lab">
      <div className="yt-lab-header">
        <div>
          <span>AUTHENTIC LISTENING · YOUTUBE LAB</span>
          <h2>Try something new for 30 days</h2>
          <p>Matt Cutts · TED · 3:26</p>
        </div>
        <a
          href="https://www.youtube.com/watch?v=UNP03fDSj1U"
          target="_blank"
          rel="noreferrer"
        >
          Open source <ExternalLink />
        </a>
      </div>
      <div className="yt-layout">
        <div className="yt-player">
          <YouTube
            videoId="UNP03fDSj1U"
            onReady={onReady}
            onStateChange={(event) => {
              if (event.data === 2) setPlaying(false);
            }}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                rel: 0,
                modestbranding: 1,
                playsinline: 1,
                cc_load_policy: 1,
                origin: window.location.origin,
              },
            }}
          />
        </div>
        <aside className="segment-list">
          <span>MICRO-LISTENING</span>
          {segments.map((segment, index) => (
            <button
              className={active.id === segment.id ? "active" : ""}
              onClick={() => selectSegment(segment)}
              key={segment.id}
            >
              <i>{String(index + 1).padStart(2, "0")}</i>
              <span>
                <b>{segment.title}</b>
                <small>
                  {formatTime(segment.start)}–{formatTime(segment.end)} ·{" "}
                  {segment.focus}
                </small>
              </span>
              {attempts[segment.id] ? <Check /> : null}
            </button>
          ))}
        </aside>
      </div>
      <div className="clip-console">
        <div className="clip-meta">
          <span>NOW PRACTISING</span>
          <h3>{active.title}</h3>
          <p>
            Listen without reading first. Replay, then reveal the target phrase.
          </p>
        </div>
        <div className="clip-controls">
          <button
            className="clip-play"
            disabled={!ready}
            onClick={playing ? pause : () => playSegment()}
          >
            {playing ? <Pause /> : <Play />}
            {playing
              ? "Pause"
              : attempts[active.id]
                ? "Replay clip"
                : "Play clip"}
          </button>
          <label>
            <Gauge /> Speed
            <select
              value={speed}
              onChange={(event) => {
                const rate = Number(event.target.value);
                setSpeed(rate);
                player.current?.setPlaybackRate(rate);
              }}
            >
              <option value="0.75">0.75×</option>
              <option value="1">1×</option>
            </select>
          </label>
          <button
            className="reveal"
            onClick={() => setPhraseVisible(!phraseVisible)}
          >
            {phraseVisible ? <EyeOff /> : <Eye />}
            {phraseVisible ? "Hide phrase" : "Reveal phrase"}
          </button>
        </div>
        {phraseVisible && (
          <div className="shadow-panel">
            <div>
              <span>TARGET PHRASE</span>
              <p>{active.phrase}</p>
              <small>{kk ? active.kk : active.stress}</small>
            </div>
            <button onClick={() => playSegment(active, 0.75)}>
              <Volume2 /> Shadow at 0.75×
            </button>
          </div>
        )}
        <div className="attempt-note">
          <RotateCcw />
          <span>
            {attempts[active.id] || 0} listening attempt
            {attempts[active.id] === 1 ? "" : "s"} for this segment
          </span>
        </div>
      </div>
    </section>
  );
}
