-- English City: initial multi-user schema and row-level security.
create type public.user_role as enum ('student', 'teacher', 'admin');
create type public.submission_kind as enum ('writing', 'speaking');
create type public.submission_status as enum ('draft', 'submitted', 'reviewed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.user_role not null default 'student',
  created_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  join_code text not null unique default upper(substr(md5(random()::text), 1, 7)),
  created_at timestamptz not null default now()
);

create table public.class_members (
  class_id uuid references public.classes(id) on delete cascade,
  student_id uuid references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

create table public.lesson_progress (
  student_id uuid references public.profiles(id) on delete cascade,
  lesson_id text not null,
  completed boolean not null default false,
  score numeric(5,2),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (student_id, lesson_id)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null,
  kind public.submission_kind not null,
  content text,
  audio_path text,
  status public.submission_status not null default 'draft',
  score numeric(5,2),
  feedback text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.submissions enable row level security;

create function public.is_teacher_of(target_student uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.classes c join public.class_members cm on cm.class_id = c.id
    where c.teacher_id = auth.uid() and cm.student_id = target_student
  ) or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "profiles: own or assigned teacher" on public.profiles for select using (id = auth.uid() or public.is_teacher_of(id));
create policy "profiles: update own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "classes: teacher owns" on public.classes for all using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());
create policy "members: class participants" on public.class_members for select using (student_id = auth.uid() or exists (select 1 from public.classes where id = class_id and teacher_id = auth.uid()));
create policy "members: students join" on public.class_members for insert with check (student_id = auth.uid());
create policy "progress: student owns" on public.lesson_progress for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "progress: teacher reads" on public.lesson_progress for select using (public.is_teacher_of(student_id));
create policy "submissions: student owns" on public.submissions for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "submissions: teacher reads" on public.submissions for select using (public.is_teacher_of(student_id));
create policy "submissions: teacher reviews" on public.submissions for update using (public.is_teacher_of(student_id));

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'student');
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create view public.teacher_student_progress with (security_invoker = true) as
select p.id, p.full_name,
  count(lp.lesson_id) filter (where lp.completed)::int as completed_lessons,
  max(lp.updated_at) as last_active
from public.profiles p
left join public.lesson_progress lp on lp.student_id = p.id
where p.role = 'student' and public.is_teacher_of(p.id)
group by p.id, p.full_name;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('student-audio', 'student-audio', false, 10485760, array['audio/webm','audio/mpeg','audio/mp4']);
create policy "audio: student uploads own folder" on storage.objects for insert to authenticated with check (bucket_id = 'student-audio' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "audio: student or teacher reads" on storage.objects for select to authenticated using (bucket_id = 'student-audio' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_teacher_of(((storage.foldername(name))[1])::uuid)));
