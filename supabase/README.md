# Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor**, paste `migrations/202610140001_initial_platform.sql`, and run it once.
3. In **Authentication → URL Configuration**, set the Site URL to the GitHub Pages URL and add the same URL to Redirect URLs:
   `https://eldar0904.github.io/English-City-/`
4. In GitHub, open **Settings → Secrets and variables → Actions → Variables** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Re-run the `Deploy English City` workflow.

For local development, copy `.env.example` to `.env.local` and fill the same two public values. Do not commit `.env.local`.

New accounts are students by default. To promote the first teacher after signup, run this in the Supabase SQL Editor, replacing the email:

```sql
update public.profiles
set role = 'teacher'
where id = (select id from auth.users where email = 'teacher@example.com');
```

Teachers only see students assigned through `class_members`. The schema enforces this through Row Level Security.
