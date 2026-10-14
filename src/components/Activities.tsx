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
import danaScenes from "../assets/dana-listening-grid.webp";
import vocabularyScenes from "../assets/vocabulary-scenes.webp";

const visualScenes = [
  { label: "Dana reads a poster while waiting for a bus.", position: "0% 0%" },
  { label: "Dana reads a leaflet inside the bus.", position: "100% 0%" },
  { label: "Dana puts a poster on a noticeboard.", position: "0% 100%" },
  { label: "Dana photographs a bus at the bus stop.", position: "100% 100%" },
];

export function VisualListening({ kk }: { kk: boolean }) {
  const [answer, setAnswer] = useState<number | null>(null);
  const sentence =
    "While Dana was waiting for a bus, she noticed a poster for a photography walk.";
  function listen(rate = 0.88) {
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "en-GB";
    utterance.rate = rate;
    window.speechSynthesis?.speak(utterance);
  }
  return (
    <section className="visual-listening">
      <div className="visual-title">
        <div>
          <span>LISTEN & LOOK</span>
          <h2>Which scene matches?</h2>
          <p>
            {kk
              ? "Сөйлемді тыңдап, сәйкес суретті таңдаңыз."
              : "Listen carefully and choose the matching scene."}
          </p>
        </div>
        <button onClick={() => listen()}>
          <Headphones /> Play sentence
        </button>
      </div>
      <div className="scene-grid">
        {visualScenes.map((scene, index) => (
          <button
            key={scene.label}
            aria-label={scene.label}
            onClick={() => setAnswer(index)}
            className={
              answer === null
                ? ""
                : index === 0
                  ? "correct"
                  : answer === index
                    ? "wrong"
                    : "muted"
            }
          >
            <i
              style={{
                backgroundImage: `url(${danaScenes})`,
                backgroundPosition: scene.position,
              }}
            />
            <b>{String.fromCharCode(65 + index)}</b>
            {answer !== null && index === 0 && (
              <span>
                <Check /> Correct
              </span>
            )}
          </button>
        ))}
      </div>
      {answer !== null && (
        <div className={answer === 0 ? "visual-result good" : "visual-result"}>
          <div>
            <b>
              {answer === 0
                ? "Exactly — she was at the bus stop."
                : "Not quite. Focus on where Dana was and what she noticed."}
            </b>
            <p>
              {answer === 0
                ? sentence
                : kk
                  ? "Сөйлемді тағы бір рет тыңдап көріңіз."
                  : "Listen once more, then choose again."}
            </p>
          </div>
          <button
            onClick={() => {
              if (answer === 0) listen(0.72);
              else {
                setAnswer(null);
                listen();
              }
            }}
          >
            {answer === 0 ? (
              <>
                <Volume2 /> Shadow slowly
              </>
            ) : (
              <>
                <RotateCcw /> Try again
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}

const sentenceChunks = [
  "While Dana was waiting",
  "for a bus,",
  "she noticed a poster",
  "for a photography walk.",
];
const shuffledChunks = [
  sentenceChunks[2],
  sentenceChunks[0],
  sentenceChunks[3],
  sentenceChunks[1],
];

export function SentenceBuilder({ kk }: { kk: boolean }) {
  const [chosen, setChosen] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const remaining = shuffledChunks.filter((chunk) => !chosen.includes(chunk));
  const correct = chosen.join(" ") === sentenceChunks.join(" ");
  function reset() {
    setChosen([]);
    setChecked(false);
  }
  return (
    <section className="sentence-builder">
      <div className="builder-heading">
        <span>BUILD THE SENTENCE</span>
        <h3>Put the chunks in the order you heard.</h3>
        <p>
          {kk
            ? "Сөйлем бөліктерін дұрыс ретпен орналастырыңыз."
            : "Think in phrases, not individual words."}
        </p>
      </div>
      <div
        className={
          checked
            ? correct
              ? "build-line correct"
              : "build-line wrong"
            : "build-line"
        }
      >
        {chosen.length ? (
          chosen.map((chunk, index) => (
            <button
              key={chunk}
              onClick={() => {
                setChosen((value) => value.filter((_, i) => i !== index));
                setChecked(false);
              }}
            >
              {chunk}
              <small>{index + 1}</small>
            </button>
          ))
        ) : (
          <span>Select the first chunk below…</span>
        )}
      </div>
      <div className="chunk-bank">
        {remaining.map((chunk) => (
          <button
            key={chunk}
            onClick={() => {
              setChosen((value) => [...value, chunk]);
              setChecked(false);
            }}
          >
            {chunk}
          </button>
        ))}
      </div>
      <div className="builder-actions">
        <button onClick={reset}>
          <RotateCcw /> Reset
        </button>
        <button
          disabled={chosen.length !== sentenceChunks.length}
          onClick={() => setChecked(true)}
        >
          Check sentence <Check />
        </button>
      </div>
      {checked && (
        <div className={correct ? "builder-feedback good" : "builder-feedback"}>
          {correct
            ? "Perfect. Now say the complete sentence aloud with natural rhythm."
            : "Almost. Start with the background action: “While Dana was waiting…”"}
        </div>
      )}
    </section>
  );
}

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

const vocabPositions = [
  "0% 0%",
  "50% 0%",
  "100% 0%",
  "0% 100%",
  "50% 100%",
  "100% 100%",
];

export function VisualVocabulary({
  words,
  kk,
}: {
  words: string[][];
  kk: boolean;
}) {
  const [stage, setStage] = useState<"recognise" | "recall" | "finished">(
    "recognise",
  );
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const correct = answer === round;
  function next() {
    setAnswer(null);
    if (round < words.length - 1) setRound((value) => value + 1);
    else if (stage === "recognise") {
      setStage("recall");
      setRound(0);
    } else setStage("finished");
  }
  if (stage === "finished")
    return (
      <div className="vocab-finished">
        <Check />
        <div>
          <b>Two retrieval rounds complete</b>
          <span>
            {kk
              ? "Енді тіркестерді өз сөйлемдеріңізде қолданыңыз."
              : "Now use two of the phrases in your own sentences."}
          </span>
        </div>
        <button
          onClick={() => {
            setStage("recognise");
            setRound(0);
          }}
        >
          Practise again
        </button>
      </div>
    );
  return (
    <section className="visual-vocab">
      <div className="vocab-stage">
        <span>
          {stage === "recognise" ? "ROUND 1 · MEANING" : "ROUND 2 · RECALL"}
        </span>
        <b>
          {round + 1} / {words.length}
        </b>
      </div>
      {stage === "recognise" ? (
        <>
          <h3>
            Which image best shows <em>“{words[round][0]}”</em>?
          </h3>
          <div className="vocab-scene-grid">
            {words.map(([phrase], index) => (
              <button
                key={phrase}
                aria-label={`Scene ${index + 1}`}
                onClick={() => answer === null && setAnswer(index)}
                className={
                  answer === null
                    ? ""
                    : index === round
                      ? "correct"
                      : index === answer
                        ? "wrong"
                        : "muted"
                }
              >
                <i
                  style={{
                    backgroundImage: `url(${vocabularyScenes})`,
                    backgroundPosition: vocabPositions[index],
                  }}
                />
                <b>{String.fromCharCode(65 + index)}</b>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="recall-scene">
            <i
              style={{
                backgroundImage: `url(${vocabularyScenes})`,
                backgroundPosition: vocabPositions[round],
              }}
            />
            <div>
              <span>KAZAKH CUE</span>
              <h3>{words[round][1]}</h3>
              <p>Choose the English phrase.</p>
            </div>
          </div>
          <div className="recall-options">
            {words.map(([phrase], index) => (
              <button
                key={phrase}
                onClick={() => answer === null && setAnswer(index)}
                className={
                  answer === null
                    ? ""
                    : index === round
                      ? "correct"
                      : index === answer
                        ? "wrong"
                        : "muted"
                }
              >
                {phrase}
                {answer !== null && index === round && <Check />}
              </button>
            ))}
          </div>
        </>
      )}
      {answer !== null && (
        <div className={correct ? "vocab-feedback good" : "vocab-feedback"}>
          <div>
            <b>
              {correct
                ? "Correct — make a mental picture of the phrase."
                : "Not this time. Compare the action in each image."}
            </b>
            {correct && (
              <span>
                {words[round][0]} · {words[round][1]}
              </span>
            )}
          </div>
          <button onClick={correct ? next : () => setAnswer(null)}>
            {correct ? "Next" : "Try again"}
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
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
