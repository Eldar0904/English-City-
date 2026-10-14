import { useState } from "react";
import { Check, RotateCcw, Sparkles } from "lucide-react";
import YouTubeClip from "./YouTubeClip";

const sentenceChunks = ["I decided", "to try something new", "for 30 days."];

export function YouTubeMicroLesson({ kk }: { kk: boolean }) {
  const [answer, setAnswer] = useState("");
  const [built, setBuilt] = useState<string[]>([]);
  const correct = answer === "one-new-thing";

  function addChunk(chunk: string) {
    if (!built.includes(chunk)) setBuilt([...built, chunk]);
  }

  return (
    <section className="video-activity">
      <div className="activity-kicker">
        <span>MICRO-LISTENING · 01</span>
        <b>{kk ? "Алдымен жалпы мағынаны тыңдаңыз" : "Listen for the big idea first"}</b>
      </div>
      <YouTubeClip start={16} end={37} label="The 30-day idea" />
      <div className="gist-check">
        <h3>What did Matt decide to do?</h3>
        <div>
          {[
            ["one-new-thing", "Try something new for 30 days"],
            ["change-job", "Find a different job in 30 days"],
            ["travel", "Travel to a new country"],
          ].map(([value, label]) => (
            <button
              className={answer === value ? (value === "one-new-thing" ? "correct" : "wrong") : ""}
              key={value}
              onClick={() => setAnswer(value)}
            >
              {answer === value && value === "one-new-thing" && <Check />}
              {label}
            </button>
          ))}
        </div>
        {answer && (
          <p className={correct ? "feedback success" : "feedback"}>
            {correct
              ? kk
                ? "Дұрыс. Енді негізгі сөйлемді бөліктерден құраңыз."
                : "Exactly. Now rebuild the key sentence."
              : kk
                ? "Тағы бір рет тыңдаңыз: ол 30 күндік тәжірибе туралы айтады."
                : "Listen once more: he describes a 30-day experiment."}
          </p>
        )}
      </div>
      {correct && (
        <div className="video-builder">
          <div>
            <span>NOTICE THE CHUNKS</span>
            <h3>Build what you heard</h3>
          </div>
          <div className="built-line">
            {built.length ? built.join(" ") : <em>Choose the first chunk…</em>}
          </div>
          <div className="chunk-bank">
            {sentenceChunks.map((chunk) => (
              <button disabled={built.includes(chunk)} onClick={() => addChunk(chunk)} key={chunk}>
                {chunk}
              </button>
            ))}
            <button className="reset-chunks" onClick={() => setBuilt([])} aria-label="Reset sentence">
              <RotateCcw />
            </button>
          </div>
          {built.length === sentenceChunks.length && (
            <p className="feedback success">
              {built.join(" ") === sentenceChunks.join(" ")
                ? kk
                  ? "Керемет! Видеоны қайталап, сөйлемді сөйлеушімен бірге айтыңыз."
                  : "Great. Replay and shadow the complete sentence with the speaker."
                : kk
                  ? "Сөздер дұрыс, бірақ реті қате. Қайта көріңіз."
                  : "The chunks are right, but the order is not. Try again."}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export function YouTubeSpeakingModel({ kk }: { kk: boolean }) {
  return (
    <section className="speaking-model">
      <div className="speaking-model-copy">
        <span><Sparkles /> MODEL &amp; PERSONALISE</span>
        <h2>Borrow the rhythm, not the story</h2>
        <p>
          {kk
            ? "Қысқа үзіндіні тыңдаңыз. Содан кейін үлгіні өз ойыңызбен толықтырыңыз."
            : "Listen to the short clip, then make the pattern your own."}
        </p>
        <blockquote>“Why not think about something you have always wanted to try?”</blockquote>
        <div className="speech-frame">
          <b>I’ve always wanted to…</b>
          <span>learn to cook / run 5 km / speak English every day</span>
        </div>
      </div>
      <YouTubeClip start={174} end={191} label="Give it a shot" compact />
    </section>
  );
}
