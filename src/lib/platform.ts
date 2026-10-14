import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type UserRole = "student" | "teacher" | "admin";
export type Profile = { id: string; full_name: string; role: UserRole };
export type SubmissionInput = {
  lessonId: string;
  kind: "writing" | "speaking";
  text?: string;
  audioPath?: string;
};

export async function getProfile(session: Session): Promise<Profile> {
  const { data, error } = await supabase!
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", session.user.id)
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function getCompletedLessons(userId: string) {
  const { data, error } = await supabase!
    .from("lesson_progress")
    .select("lesson_id")
    .eq("student_id", userId)
    .eq("completed", true);
  if (error) throw error;
  return data.map((row) => row.lesson_id as string);
}

export async function completeLesson(userId: string, lessonId: string) {
  const { error } = await supabase!.from("lesson_progress").upsert(
    {
      student_id: userId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "student_id,lesson_id" },
  );
  if (error) throw error;
}

export async function submitWork(userId: string, input: SubmissionInput) {
  const { error } = await supabase!.from("submissions").insert({
    student_id: userId,
    lesson_id: input.lessonId,
    kind: input.kind,
    content: input.text ?? null,
    audio_path: input.audioPath ?? null,
    status: "submitted",
  });
  if (error) throw error;
}

export async function getTeacherDashboard() {
  const [
    { data: students, error: studentsError },
    { data: submissions, error: submissionsError },
  ] = await Promise.all([
    supabase!.from("teacher_student_progress").select("*"),
    supabase!
      .from("submissions")
      .select(
        "id, kind, status, created_at, profiles!submissions_student_id_fkey(full_name)",
      )
      .eq("status", "submitted")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);
  if (studentsError) throw studentsError;
  if (submissionsError) throw submissionsError;
  return { students: students ?? [], submissions: submissions ?? [] };
}
