import { useState, type CSSProperties, type ReactNode } from "react";
import { Check, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import scenes from "../assets/vocabulary-scenes-v2.webp";
import { SpeakingRecorder } from "./Activities";
import YouTubeClip from "./YouTubeClip";

type Stage = "explore" | "images" | "recall" | "context" | "speak" | "result";

const positions = ["0% 0%", "50% 0%", "100% 0%", "0% 100%", "50% 100%", "100% 100%"];
const contexts = [
  { text: "I moved to Astana last month. It took me a week to ___ in my new flat.", answer: 0 },
  { text: "The photography walk was a real ___: I discovered what I wanted to do.", answer: 4 },
  { text: "I was nervous about public speaking, but I decided to ___.", answer: 5 },
];

function optionsFor(index: number, total: number) {
  return [index, (index + 2) % total, (index + 4) % total].sort((a, b) => a - b);
}

export default function VocabularyJourney({ words, kk }: { words: string[][]; kk: boolean }) {
  const [stage, setStage] = useState<Stage>("explore");
  const [revealed, setRevealed] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [mistake, setMistake] = useState(false);
  const [score, setScore] = useState(0);
  const [spoken, setSpoken] = useState(false);
  const maxScore = words.length * 2 + contexts.length;

  function choose(index: number, correct: number) {
    setAnswer(index);
    if (index !== correct) setMistake(true);
    else if (!mistake) setScore((value) => value + 1);
  }

  function advance(nextStage: Stage, length: number) {
    if (round < length - 1) setRound((value) => value + 1);
    else {
      setStage(nextStage);
      setRound(0);
    }
    setAnswer(null);
    setMistake(false);
  }

  function restart() {
    setStage("explore");
    setRevealed([]);
    setRound(0);
    setAnswer(null);
    setMistake(false);
    setScore(0);
    setSpoken(false);
  }

  if (stage === "result") {
    const percent = Math.round((score / maxScore) * 100);
    return (
      <section className="vocab-result-card">
        <div className="mastery-ring" style={{ "--mastery": `${percent * 3.6}deg` } as CSSProperties}>
          <span>{percent}%</span>
        </div>
        <div>
          <span>VOCABULARY MASTERY</span>
          <h2>{percent >= 80 ? "Ready to use" : percent >= 60 ? "Nearly there" : "One more round"}</h2>
          <p>{score}/{maxScore} correct on the first attempt · speaking task {spoken ? "completed" : "skipped"}</p>
          <button onClick={restart}><RotateCcw /> Practise again</button>
        </div>
      </section>
    );
  }

  return (
    <section className="vocab-journey">
      <div className="journey-progress">
        {["Explore", "Images", "Recall", "Context", "Speak"].map((label, index) => {
          const activeIndex = ["explore", "images", "recall", "context", "speak"].indexOf(stage);
          return <span className={index <= activeIndex ? "active" : ""} key={label}><i>{index < activeIndex ? <Check /> : index + 1}</i>{label}</span>;
        })}
      </div>

      {stage === "explore" && (
        <div className="vocab-explore">
          <header><span>STEP 1 · NOTICE</span><h2>Connect the phrase to a local scene</h2><p>{kk ? "Әр суретті басып, мағынасын ашыңыз." : "Open every scene and say the phrase aloud."}</p></header>
          <div className="explore-grid">
            {words.map(([phrase, meaning], index) => (
              <button key={phrase} className={revealed.includes(index) ? "revealed" : ""} onClick={() => setRevealed((value) => value.includes(index) ? value : [...value, index])}>
                <i style={{ backgroundImage: `url(${scenes})`, backgroundPosition: positions[index] }} />
                <span><b>{phrase}</b><small>{revealed.includes(index) ? meaning : kk ? "Мағынасын ашу" : "Reveal meaning"}</small></span>
              </button>
            ))}
          </div>
          <button className="journey-next" disabled={revealed.length < words.length} onClick={() => setStage("images")}>Start retrieval <ChevronRight /></button>
        </div>
      )}

      {stage === "images" && (
        <ChallengeShell kicker="STEP 2 · VISUAL RETRIEVAL" count={`${round + 1}/${words.length}`} title={<>Which scene shows <em>“{words[round][0]}”</em>?</>}>
          <div className="journey-scenes">
            {words.map(([phrase], index) => <button aria-label={`Scene ${index + 1}`} key={phrase} className={answer === null ? "" : index === round ? "correct" : index === answer ? "wrong" : "muted"} onClick={() => answer === null && choose(index, round)}><i style={{ backgroundImage: `url(${scenes})`, backgroundPosition: positions[index] }} /><b>{String.fromCharCode(65 + index)}</b></button>)}
          </div>
          <Feedback answer={answer} correct={round} retry={() => { setAnswer(null); setMistake(true); }} next={() => advance("recall", words.length)} kk={kk} />
        </ChallengeShell>
      )}

      {stage === "recall" && (
        <ChallengeShell kicker="STEP 3 · ACTIVE RECALL" count={`${round + 1}/${words.length}`} title={kk ? <>Ағылшын тіліндегі дұрыс тіркесті таңдаңыз</> : <>Choose the English phrase</>}>
          <div className="recall-hero"><i style={{ backgroundImage: `url(${scenes})`, backgroundPosition: positions[round] }} /><div><span>KAZAKH CUE</span><h2>{words[round][1]}</h2></div></div>
          <div className="journey-options">{optionsFor(round, words.length).map((index) => <button key={index} className={answer === null ? "" : index === round ? "correct" : index === answer ? "wrong" : "muted"} onClick={() => answer === null && choose(index, round)}>{words[index][0]}{answer !== null && index === round && <Check />}</button>)}</div>
          <Feedback answer={answer} correct={round} retry={() => { setAnswer(null); setMistake(true); }} next={() => advance("context", words.length)} kk={kk} />
        </ChallengeShell>
      )}

      {stage === "context" && (
        <ChallengeShell kicker="STEP 4 · USE IT" count={`${round + 1}/${contexts.length}`} title={contexts[round].text}>
          <div className="journey-options context-options">{optionsFor(contexts[round].answer, words.length).map((index) => <button key={index} className={answer === null ? "" : index === contexts[round].answer ? "correct" : index === answer ? "wrong" : "muted"} onClick={() => answer === null && choose(index, contexts[round].answer)}>{words[index][0]}{answer !== null && index === contexts[round].answer && <Check />}</button>)}</div>
          <Feedback answer={answer} correct={contexts[round].answer} retry={() => { setAnswer(null); setMistake(true); }} next={() => advance("speak", contexts.length)} kk={kk} />
        </ChallengeShell>
      )}

      {stage === "speak" && (
        <div className="vocab-speak">
          <header><span>STEP 5 · SPEAK</span><h2>Make the phrases yours</h2><p>{kk ? "Үлгіні тыңдап, кемінде екі жаңа тіркеспен 20 секунд сөйлеңіз." : "Listen to the model, then speak for 20 seconds using at least two new phrases."}</p></header>
          <YouTubeClip start={174} end={191} label="Authentic model: give it a shot" compact />
          <div className="speaking-prompt"><Sparkles /><div><b>My turning point was…</b><span>I decided to give ___ a try. It helped me step outside my comfort zone because…</span></div></div>
          <SpeakingRecorder onReady={() => setSpoken(true)} />
          <div className="self-check"><span className={spoken ? "recorded" : ""}><Check /> {spoken ? "Speaking recorded" : "Record your answer to finish the loop"}</span><button disabled={!spoken} onClick={() => setStage("result")}>See mastery result <ChevronRight /></button></div>
        </div>
      )}
    </section>
  );
}

function ChallengeShell({ kicker, count, title, children }: { kicker: string; count: string; title: ReactNode; children: ReactNode }) {
  return <div className="vocab-challenge"><header><span>{kicker}</span><b>{count}</b></header><h2>{title}</h2>{children}</div>;
}

function Feedback({ answer, correct, retry, next, kk }: { answer: number | null; correct: number; retry: () => void; next: () => void; kk: boolean }) {
  if (answer === null) return null;
  const right = answer === correct;
  return <div className={right ? "journey-feedback good" : "journey-feedback"}><div><b>{right ? "That’s right!" : "Good try — retrieve it once more."}</b><span>{right ? (kk ? "Сурет пен тіркесті бірге есте сақтаңыз." : "Hold the image and phrase together in your memory.") : (kk ? "Суреттегі негізгі әрекетке назар аударыңыз." : "Focus on the main action in the scene.")}</span></div><button onClick={right ? next : retry}>{right ? "Continue" : "Try again"}<ChevronRight /></button></div>;
}
