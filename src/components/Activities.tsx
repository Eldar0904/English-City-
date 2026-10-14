import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Headphones,
  Mic2,
  Pause,
  Play,
  RotateCcw,
  Square,
  Volume2,
} from "lucide-react";
import type { Question } from "../course";

export function QuestionSet({
  title,
  questions,
  kk,
  onComplete,
}: {
  title: string;
  questions: Question[];
  kk: boolean;
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const question = questions[index];
  const correct = answer === question.correct;
  function choose(option: number) {
    if (answer !== null) return;
    setAnswer(option);
    if (option === question.correct) setScore((value) => value + 1);
  }
  function next() {
    if (index === questions.length - 1) {
      onComplete();
      return;
    }
    setIndex((value) => value + 1);
    setAnswer(null);
  }
  return (
    <section className="activity-card">
      <div className="activity-top">
        <span>{title}</span>
        <b>
          {index + 1} / {questions.length}
        </b>
      </div>
      <div className="activity-dots">
        {questions.map((_, i) => (
          <i className={i <= index ? "filled" : ""} key={i} />
        ))}
      </div>
      <h2>{question.question}</h2>
      <div className="answer-list">
        {question.options.map((option, i) => (
          <button
            key={option}
            onClick={() => choose(i)}
            className={
              answer === null
                ? ""
                : i === question.correct
                  ? "correct"
                  : i === answer
                    ? "wrong"
                    : "muted"
            }
          >
            <i>{String.fromCharCode(65 + i)}</i>
            <span>{option}</span>
            {answer !== null && i === question.correct && <Check />}
          </button>
        ))}
      </div>
      {answer !== null && (
        <div
          className={correct ? "activity-feedback good" : "activity-feedback"}
        >
          <b>{correct ? "That’s right!" : "Good try — look at the clue."}</b>
          <p>{kk ? question.kk : question.explanation}</p>
          <button onClick={next}>
            {index === questions.length - 1
              ? `Finish · ${score + (correct ? 0 : 0)}/${questions.length}`
              : "Next question"}
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}

export function WordPractice({
  words,
  kk,
}: {
  words: string[][];
  kk: boolean;
}) {
  const [flipped, setFlipped] = useState<string[]>([]);
  const [known, setKnown] = useState<string[]>([]);
  return (
    <>
      <div className="practice-head">
        <span>Tap a card to reveal the meaning</span>
        <b>
          {known.length}/{words.length} confident
        </b>
      </div>
      <div className="word-grid">
        {words.map(([word, meaning], i) => (
          <button
            className={
              flipped.includes(word) ? "word-card flipped" : "word-card"
            }
            onClick={() =>
              setFlipped((value) =>
                value.includes(word)
                  ? value.filter((item) => item !== word)
                  : [...value, word],
              )
            }
            key={word}
          >
            <span>0{i + 1}</span>
            <b>{word}</b>
            <small>{flipped.includes(word) ? meaning : "Reveal meaning"}</small>
            {flipped.includes(word) && (
              <em
                onClick={(event) => {
                  event.stopPropagation();
                  setKnown((value) =>
                    value.includes(word)
                      ? value.filter((item) => item !== word)
                      : [...value, word],
                  );
                }}
              >
                {known.includes(word) ? (
                  <>
                    <Check /> I know this
                  </>
                ) : (
                  "Mark as learned"
                )}
              </em>
            )}
          </button>
        ))}
      </div>
      {kk && (
        <p className="language-tip">
          <b>Тілдік кеңес:</b> сөз тіркесін жеке сөз ретінде емес, тұтас күйінде
          жаттаңыз.
        </p>
      )}
    </>
  );
}

export function ListeningPlayer({ transcript }: { transcript: string }) {
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [showTranscript, setShowTranscript] = useState(false);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  function play() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.lang = "en-GB";
    utterance.rate = rate;
    utterance.onend = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(utterance);
  }
  function stop() {
    window.speechSynthesis?.cancel();
    setPlaying(false);
  }
  return (
    <div className="listening-player">
      <div className="listen-main">
        <button className="listen-play" onClick={playing ? stop : play}>
          {playing ? <Pause /> : <Play />}
        </button>
        <div>
          <span>LISTENING · 01</span>
          <h3>My first day in Almaty</h3>
          <div className="sound-wave">
            {Array.from({ length: 28 }).map((_, i) => (
              <i key={i} style={{ height: `${8 + ((i * 7) % 22)}px` }} />
            ))}
          </div>
        </div>
        <Volume2 />
      </div>
      <div className="listen-tools">
        <label>
          Speed
          <select
            value={rate}
            onChange={(event) => setRate(Number(event.target.value))}
          >
            <option value="0.75">0.75×</option>
            <option value="0.9">0.9×</option>
            <option value="1">1×</option>
          </select>
        </label>
        <button onClick={() => setShowTranscript(!showTranscript)}>
          {showTranscript ? "Hide transcript" : "Show transcript"}
        </button>
      </div>
      {showTranscript && (
        <div className="transcript">
          <span>TRANSCRIPT</span>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}

export function SpeakingRecorder({ onReady }: { onReady: () => void }) {
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(
      () => setSeconds((value) => value + 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [recording]);
  useEffect(
    () => () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    },
    [audioUrl],
  );
  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      const next = new MediaRecorder(stream);
      next.ondataavailable = (event) => chunks.current.push(event.data);
      next.onstop = () => {
        const url = URL.createObjectURL(
          new Blob(chunks.current, { type: next.mimeType }),
        );
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
        onReady();
      };
      recorder.current = next;
      setSeconds(0);
      setError("");
      setRecording(true);
      next.start();
    } catch {
      setError("Microphone access is needed to record your story.");
    }
  }
  function stop() {
    recorder.current?.stop();
    setRecording(false);
  }
  return (
    <div className="recorder">
      <div className={recording ? "record-orb live" : "record-orb"}>
        <Mic2 />
      </div>
      <h3>
        {recording
          ? "Recording your story…"
          : audioUrl
            ? "Your recording is ready"
            : "Ready when you are"}
      </h3>
      <p>
        {recording
          ? `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
          : "Aim for 45–60 seconds. You can try again."}
      </p>
      <div>
        {!recording && (
          <button className="record-primary" onClick={start}>
            <Mic2 />
            {audioUrl ? "Record again" : "Start recording"}
          </button>
        )}
        {recording && (
          <button className="record-primary stop" onClick={stop}>
            <Square /> Stop
          </button>
        )}
        {audioUrl && !recording && <audio controls src={audioUrl} />}
      </div>
      {error && <span className="record-error">{error}</span>}
    </div>
  );
}
