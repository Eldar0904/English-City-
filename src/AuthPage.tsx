import { useState, type FormEvent } from "react";
import { BookOpen, GraduationCap, LoaderCircle } from "lucide-react";
import { supabase } from "./lib/supabase";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const result =
      mode === "login"
        ? await supabase!.auth.signInWithPassword({ email, password })
        : await supabase!.auth.signUp({
            email,
            password,
            options: { data: { full_name: name, role: "student" } },
          });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else if (mode === "signup")
      setMessage("Check your email to confirm your new account.");
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <div className="brand light">
          <span>EC</span>
          <div>
            English City<small>Learn beyond borders</small>
          </div>
        </div>
        <div>
          <span className="pill">ENGLISH FOR KAZAKH SPEAKERS</span>
          <h1>Make English part of your story.</h1>
          <p>
            Practical B1 lessons, useful feedback and progress your teacher can
            see.
          </p>
        </div>
        <blockquote>
          “Күн сайын кішкентай қадам — үлкен нәтижеге бастайды.”
        </blockquote>
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          <span className="auth-icon">
            {mode === "login" ? <BookOpen /> : <GraduationCap />}
          </span>
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p>
            {mode === "login"
              ? "Continue your English journey."
              : "Start learning with Unit 1 today."}
          </p>
          {mode === "signup" && (
            <label>
              Full name
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aruzhan S."
              />
            </label>
          )}
          <label>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              required
              minLength={8}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </label>
          {message && <div className="auth-message">{message}</div>}
          <button className="auth-submit" disabled={busy}>
            {busy ? (
              <LoaderCircle className="spin" />
            ) : mode === "login" ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </button>
          <button
            type="button"
            className="auth-switch"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage("");
            }}
          >
            {mode === "login"
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
