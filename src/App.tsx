import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  BookOpen,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Headphones,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Mic2,
  PenLine,
  Play,
  Settings2,
  Sparkles,
  UsersRound,
  X,
  LogOut,
} from "lucide-react";
import {
  grammarQuestions,
  lessons,
  listeningQuestions,
  readingQuestions,
  reviewQuestions,
  vocabulary,
} from "./course";
import {
  PronunciationLab,
  QuestionSet,
  SpeakingRecorder,
} from "./components/Activities";
import YouTubeLab from "./components/YouTubeLab";
import VocabularyJourney from "./components/VocabularyJourney";
import {
  YouTubeMicroLesson,
  YouTubeSpeakingModel,
} from "./components/VideoActivities";
import AuthPage from "./AuthPage";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import {
  completeLesson,
  getCompletedLessons,
  getProfile,
  getTeacherDashboard,
  submitWork,
  type Profile,
} from "./lib/platform";

type Role = "student" | "teacher";
const saved = () => {
  try {
    return JSON.parse(localStorage.getItem("ec-progress") || "[]") as string[];
  } catch {
    return [];
  }
};

function App() {
  const [role, setRole] = useState<Role>("student");
  const [active, setActive] = useState("start");
  const [done, setDone] = useState<string[]>(saved);
  const [kk, setKk] = useState(true);
  const [nav, setNav] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (!next) setProfile(null);
      setAuthReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    Promise.all([getProfile(session), getCompletedLessons(session.user.id)])
      .then(([nextProfile, completed]) => {
        setProfile(nextProfile);
        setDone(completed);
        if (nextProfile.role !== "student") setRole("teacher");
      })
      .catch((error: Error) => setSyncMessage(error.message));
  }, [session]);
  useEffect(
    () => localStorage.setItem("ec-progress", JSON.stringify(done)),
    [done],
  );
  const complete = (id: string) => {
    setDone((d) => (d.includes(id) ? d : [...d, id]));
    if (session)
      completeLesson(session.user.id, id).catch((error: Error) =>
        setSyncMessage(error.message),
      );
  };
  const submit = (
    lessonId: string,
    kind: "writing" | "speaking",
    text?: string,
  ) => {
    if (!session) return;
    submitWork(session.user.id, { lessonId, kind, text })
      .then(() => setSyncMessage("Submitted to your teacher."))
      .catch((error: Error) => setSyncMessage(error.message));
  };
  if (!authReady)
    return <div className="app-loading">Loading English City…</div>;
  if (isSupabaseConfigured && !session) return <AuthPage />;
  if (role === "teacher")
    return (
      <Teacher live={Boolean(session)} onSwitch={() => setRole("student")} />
    );
  const lesson = lessons.find((l) => l.id === active)!;
  return (
    <div className="app-shell">
      <aside className={nav ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <span>EC</span>
          <div>
            English City<small>Learn beyond borders</small>
          </div>
          <button className="icon mobile" onClick={() => setNav(false)}>
            <X />
          </button>
        </div>
        <div className="course-label">
          <span>COURSE</span>
          <b>Everyday English · B1</b>
          <small>Unit 1 of 10</small>
        </div>
        <nav>
          {lessons.map((l) => (
            <button
              className={active === l.id ? "active" : ""}
              key={l.id}
              onClick={() => {
                setActive(l.id);
                setNav(false);
              }}
            >
              <i>{done.includes(l.id) ? <Check /> : l.number}</i>
              <span>
                {l.title}
                <small>{kk ? l.kk : l.type}</small>
              </span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div>
            <span className="avatar">AS</span>
            <span>
              {profile?.full_name || "Aruzhan S."}
              <small>{profile?.role || "Student"} · B1</small>
            </span>
          </div>
          <button className="icon">
            <Settings2 />
          </button>
        </div>
      </aside>
      <main>
        <header>
          <button className="icon mobile" onClick={() => setNav(true)}>
            <Menu />
          </button>
          <div className="crumb">
            Everyday English <ChevronRight /> Unit 1
          </div>
          <div className="header-actions">
            <button className="language" onClick={() => setKk(!kk)}>
              {kk ? "ҚАЗ" : "EN"}
            </button>
            {(!session ||
              profile?.role === "teacher" ||
              profile?.role === "admin") && (
              <button
                className="teacher-link"
                onClick={() => setRole("teacher")}
              >
                <LayoutDashboard /> Teacher view
              </button>
            )}
            {session ? (
              <button
                className="icon sign-out"
                aria-label="Sign out"
                onClick={() => supabase?.auth.signOut()}
              >
                <LogOut />
              </button>
            ) : (
              <CircleUserRound />
            )}
          </div>
        </header>
        <div className="progress-line">
          <span style={{ width: `${(done.length / lessons.length) * 100}%` }} />
        </div>
        <section className="content">
          {syncMessage && (
            <button className="sync-message" onClick={() => setSyncMessage("")}>
              {syncMessage} <X />
            </button>
          )}
          <div className="eyebrow">
            <span>UNIT 01</span> · {lesson.type} · <Clock3 /> {lesson.minutes}{" "}
            min
          </div>
          <h1>{lesson.title}</h1>
          <p className="kazakh">{kk && lesson.kk}</p>
          <Lesson
            id={active}
            done={done.includes(active)}
            onComplete={() => complete(active)}
            onSubmit={(kind, text) => submit(active, kind, text)}
            kk={kk}
          />
          <div className="lesson-footer">
            <span>
              {done.length} of {lessons.length} lessons complete
            </span>
            <button
              onClick={() => {
                const i = lessons.findIndex((l) => l.id === active);
                if (i < lessons.length - 1) setActive(lessons[i + 1].id);
              }}
            >
              Next lesson <ChevronRight />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function Lesson({
  id,
  done,
  onComplete,
  onSubmit,
  kk,
}: {
  id: string;
  done: boolean;
  onComplete: () => void;
  onSubmit: (kind: "writing" | "speaking", text?: string) => void;
  kk: boolean;
}) {
  const [draft, setDraft] = useState("");
  if (id === "start")
    return (
      <>
        <div className="hero-card">
          <div>
            <span className="pill">NEW BEGINNINGS</span>
            <h2>When did you last try something new?</h2>
            <p>
              In this unit, you’ll talk about life changes, understand stories
              and share one of your own.
            </p>
            <div className="skills">
              <span>
                <BookOpen /> Read
              </span>
              <span>
                <Headphones /> Listen
              </span>
              <span>
                <Mic2 /> Speak
              </span>
              <span>
                <PenLine /> Write
              </span>
            </div>
          </div>
          <div className="hero-art">
            <Sparkles />
            <b>
              START
              <br />
              SOMEWHERE.
            </b>
          </div>
        </div>
        <YouTubeMicroLesson kk={kk} />
        <Prompt
          question="Think of one thing you started recently. What made you begin?"
          hint={
            kk
              ? "Жақында бастаған бір ісіңіз туралы ойланыңыз."
              : "Write two or three sentences."
          }
        />
        <Complete done={done} onClick={onComplete} />
      </>
    );
  if (id === "words")
    return (
      <>
        <Intro
          title="Build your word power"
          text="Match each useful phrase with its Kazakh meaning, then use two phrases in a sentence."
        />
        <VocabularyJourney words={vocabulary} kk={kk} />
        <Complete done={done} onClick={onComplete} />
      </>
    );
  if (id === "grammar")
    return (
      <>
        <div className="grammar-guide">
          <span>PAST SIMPLE</span>
          <b>completed event</b>
          <em>I saw a poster.</em>
          <i>+</i>
          <span>PAST CONTINUOUS</span>
          <b>background action</b>
          <em>I was waiting for a bus.</em>
        </div>
        <PronunciationLab kk={kk} />
        <QuestionSet
          title="GRAMMAR PRACTICE"
          questions={grammarQuestions}
          kk={kk}
          onComplete={onComplete}
        />
      </>
    );
  if (id === "read")
    return (
      <>
        <Intro
          title="One decision, a new direction"
          text="Read Dana’s short story. What changed her plans?"
        />
        <article className="reading">
          <p>
            Last spring, Dana was working in a busy office in Astana. She liked
            her colleagues, but she felt that every day was the same. One
            evening, while she was waiting for a bus, she saw a poster for a
            weekend photography walk.
          </p>
          <p>
            Dana nearly walked past it. Then she remembered the camera her
            grandfather had given her and signed up. During the walk, she met
            people who saw the city in a completely different way. Six months
            later, she still works at the same office—but now she also
            photographs local events. That rainy evening became a small turning
            point.
          </p>
        </article>
        <QuestionSet
          title="READING CHECK"
          questions={readingQuestions}
          kk={kk}
          onComplete={onComplete}
        />
      </>
    );
  if (id === "listen")
    return (
      <>
        <Intro
          title="A 30-day experiment"
          text="Watch once for the main idea, then use the timestamped clips for detailed listening and shadowing."
        />
        <YouTubeLab kk={kk} />
        <QuestionSet
          title="LISTENING CHECK"
          questions={listeningQuestions}
          kk={kk}
          onComplete={onComplete}
        />
      </>
    );
  if (id === "speak")
    return (
      <>
        <Intro
          title="Your 60-second story"
          text="Plan and record a story about doing something for the first time."
        />
        <div className="steps">
          <div>
            <i>1</i>
            <span>
              <b>Set the scene</b>Where were you? What were you doing?
            </span>
          </div>
          <div>
            <i>2</i>
            <span>
              <b>Describe the moment</b>What happened? How did you feel?
            </span>
          </div>
          <div>
            <i>3</i>
            <span>
              <b>Reflect</b>What did you learn?
            </span>
          </div>
        </div>
        <YouTubeSpeakingModel kk={kk} />
        <SpeakingRecorder onReady={() => undefined} />
        <Complete done={done} onClick={onComplete} />
      </>
    );
  if (id === "write")
    return (
      <>
        <Intro
          title="Write: An unforgettable day"
          text="Write 100–120 words. Use time expressions and both past tenses."
        />
        <Prompt
          question="Your story"
          hint="At first… / While I was… / Suddenly… / In the end…"
          large
          value={draft}
          onChange={setDraft}
        />
        <div className="checklist">
          <b>Before you submit</b>
          <label>
            <input type="checkbox" /> I set the scene clearly.
          </label>
          <label>
            <input type="checkbox" /> I used past simple and past continuous.
          </label>
          <label>
            <input type="checkbox" /> I checked spelling and punctuation.
          </label>
        </div>
        <Complete
          done={done}
          onClick={() => {
            onSubmit("writing", draft);
            onComplete();
          }}
          label="Submit for feedback"
        />
      </>
    );
  return (
    <>
      <div className="score-card">
        <span>UNIT CHECKPOINT</span>
        <strong>{done ? "✓" : "8/8"}</strong>
        <h2>You’re building momentum</h2>
        <p>Complete the remaining lessons, then take a short review quiz.</p>
      </div>
      <QuestionSet
        title="UNIT CHECK"
        questions={reviewQuestions}
        kk={kk}
        onComplete={onComplete}
      />
    </>
  );
}

function Intro({ title, text }: { title: string; text: string }) {
  return (
    <div className="intro">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}
function Prompt({
  question,
  hint,
  large = false,
  value,
  onChange,
}: {
  question: string;
  hint: string;
  large?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="prompt">
      <label>{question}</label>
      <textarea
        rows={large ? 7 : 3}
        placeholder={hint}
        value={value}
        onChange={
          onChange ? (event) => onChange(event.target.value) : undefined
        }
      />
      <small>
        {onChange
          ? `${value?.trim() ? value.trim().split(/\s+/).length : 0} words · target 100–120`
          : "Your work is saved on this device."}
      </small>
    </div>
  );
}
function Complete({
  done,
  onClick,
  label,
}: {
  done: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button className={done ? "complete done" : "complete"} onClick={onClick}>
      {done ? (
        <>
          <Check /> Completed
        </>
      ) : (
        label || "Mark lesson complete"
      )}
    </button>
  );
}
function Quiz({
  title,
  question,
  options,
  correct,
  explanation,
  done,
  onComplete,
}: {
  title: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  done: boolean;
  onComplete: () => void;
}) {
  const [answer, setAnswer] = useState<number | null>(null);
  const checked = answer !== null;
  return (
    <div className="quiz">
      <span className="pill">QUICK CHECK</span>
      <h2>{title}</h2>
      <p>{question}</p>
      <div>
        {options.map((o, i) => (
          <button
            key={o}
            className={
              checked
                ? i === correct
                  ? "correct"
                  : i === answer
                    ? "wrong"
                    : ""
                : ""
            }
            onClick={() => setAnswer(i)}
          >
            <i>{String.fromCharCode(65 + i)}</i>
            {o}
            {checked && i === correct && <Check />}
          </button>
        ))}
      </div>
      {checked && (
        <div className="feedback">
          <b>
            {answer === correct ? "Exactly!" : "Not quite — have another look."}
          </b>
          <span>{explanation}</span>
        </div>
      )}
      {answer === correct && <Complete done={done} onClick={onComplete} />}
    </div>
  );
}

function Teacher({ onSwitch, live }: { onSwitch: () => void; live: boolean }) {
  const [tab, setTab] = useState("Overview");
  const demoStudents = useMemo(
    () => [
      { n: "Aruzhan S.", p: 63, last: "Writing draft", status: "On track" },
      { n: "Dias K.", p: 88, last: "Speaking task", status: "Excellent" },
      { n: "Madina T.", p: 38, last: "Grammar", status: "Needs support" },
      { n: "Nursultan A.", p: 75, last: "Listening", status: "On track" },
    ],
    [],
  );
  const [students, setStudents] = useState(demoStudents);
  const [submissionNames, setSubmissionNames] = useState([
    "Aruzhan · An unforgettable day",
    "Dias · My 60-second story",
    "Madina · An unforgettable day",
  ]);
  useEffect(() => {
    if (!live) return;
    getTeacherDashboard()
      .then(({ students: rows, submissions }) => {
        setStudents(
          rows.map((row: Record<string, unknown>) => {
            const completed = Number(row.completed_lessons ?? 0);
            return {
              n: String(row.full_name || "Student"),
              p: Math.round((completed / lessons.length) * 100),
              last: completed ? `${completed} lessons complete` : "Not started",
              status: completed < 3 ? "Needs support" : "On track",
            };
          }),
        );
        setSubmissionNames(
          submissions.map((row: Record<string, unknown>) => {
            const profile = row.profiles as { full_name?: string } | null;
            return `${profile?.full_name || "Student"} · ${row.kind === "speaking" ? "Speaking task" : "Writing task"}`;
          }),
        );
      })
      .catch(() => undefined);
  }, [live]);
  return (
    <div className="teacher">
      <aside>
        <div className="brand light">
          <span>EC</span>
          <div>
            English City<small>Teacher workspace</small>
          </div>
        </div>
        <nav>
          {["Overview", "Courses", "Students", "Submissions", "Resources"].map(
            (x, i) => (
              <button
                className={tab === x ? "active" : ""}
                onClick={() => setTab(x)}
                key={x}
              >
                {
                  [
                    <LayoutDashboard />,
                    <BookOpen />,
                    <UsersRound />,
                    <PenLine />,
                    <Sparkles />,
                  ][i]
                }
                {x}
                {x === "Submissions" && <em>{submissionNames.length}</em>}
              </button>
            ),
          )}
        </nav>
        <button className="back" onClick={onSwitch}>
          <ChevronRight /> Student view
        </button>
      </aside>
      <main>
        <header>
          <div>
            <span>TEACHER WORKSPACE</span>
            <h1>Good morning, Aigul</h1>
          </div>
          <button className="publish">
            <Sparkles /> Create lesson
          </button>
        </header>
        <section>
          <div className="admin-banner">
            <div>
              <span>ACTIVE COURSE</span>
              <h2>Everyday English · B1</h2>
              <p>Unit 1 · New beginnings</p>
            </div>
            <div>
              <b>{students.length}</b>
              <small>Students</small>
            </div>
            <div>
              <b>66%</b>
              <small>Avg. progress</small>
            </div>
            <button>
              Manage course <ChevronRight />
            </button>
          </div>
          <div className="metric-grid">
            <div>
              <span>
                <UsersRound />
              </span>
              <b>{students.length}</b>
              <small>Active students</small>
              <em>+1 this week</em>
            </div>
            <div>
              <span>
                <PenLine />
              </span>
              <b>{submissionNames.length}</b>
              <small>Awaiting feedback</small>
              <em>3 writing · 3 speaking</em>
            </div>
            <div>
              <span>
                <BookOpen />
              </span>
              <b>7.4</b>
              <small>Average score</small>
              <em>out of 10</em>
            </div>
          </div>
          <div className="admin-grid">
            <div className="panel">
              <div className="panel-title">
                <div>
                  <span>CLASS PROGRESS</span>
                  <h2>Unit 1 overview</h2>
                </div>
                <button>View all</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Progress</th>
                    <th>Current lesson</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.n}>
                      <td>
                        <i className="mini-avatar">
                          {s.n
                            .split(" ")
                            .map((x) => x[0])
                            .join("")}
                        </i>
                        <b>{s.n}</b>
                      </td>
                      <td>
                        <div className="bar">
                          <i style={{ width: s.p + "%" }} />
                        </div>
                        <small>{s.p}%</small>
                      </td>
                      <td>{s.last}</td>
                      <td>
                        <span
                          className={
                            "status " +
                            (s.status === "Needs support" ? "warn" : "")
                          }
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="panel submissions">
              <div className="panel-title">
                <div>
                  <span>TO REVIEW</span>
                  <h2>Recent submissions</h2>
                </div>
              </div>
              {submissionNames.map((x, i) => (
                <div className="submission" key={x}>
                  <i>{i === 1 ? <Mic2 /> : <PenLine />}</i>
                  <span>
                    <b>{x}</b>
                    <small>
                      {i === 0
                        ? "12 min ago"
                        : i === 1
                          ? "1 hour ago"
                          : "Yesterday"}
                    </small>
                  </span>
                  <button>Review</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
