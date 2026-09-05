-- =================================================================
-- Ummah Hub — Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =================================================================

-- ─── PROFILES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text,
  display_name text NOT NULL DEFAULT 'Community Member',
  city        text DEFAULT 'Teaneck',
  avatar_url  text,
  interests   text[] DEFAULT '{}',
  role        text NOT NULL DEFAULT 'member'
                CHECK (role IN ('member', 'admin', 'mosque_admin')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_all"   ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own"   ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── POSTS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       text NOT NULL CHECK (char_length(title) BETWEEN 3 AND 300),
  body        text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 10000),
  category    text NOT NULL DEFAULT 'general'
                CHECK (category IN (
                  'general','questions','events','recommendations','jobs',
                  'housing','education','marriage_family','students','youth',
                  'businesses','volunteering','announcements','buy_sell','lost_found'
                )),
  is_pinned   boolean NOT NULL DEFAULT false,
  tags        text[] DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "posts_select_all"   ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts_insert_auth"  ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_update_own"   ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "posts_delete_own"   ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- ─── COMMENTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id           uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id           uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body              text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 5000),
  parent_comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select_all"  ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_auth" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update_own"  ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete_own"  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- ─── VOTES ───────────────────────────────────────────────────
-- value: 1 = upvote, -1 = downvote
CREATE TABLE IF NOT EXISTS public.votes (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id   uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  value     smallint NOT NULL CHECK (value IN (1, -1)),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, post_id)   -- prevents duplicate votes
);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "votes_select_all"   ON public.votes FOR SELECT USING (true);
CREATE POLICY "votes_insert_auth"  ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "votes_update_own"   ON public.votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "votes_delete_own"   ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- ─── BOOKMARKS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, post_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarks_owner_only" ON public.bookmarks
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── FOLLOWS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.follows (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mosque_id   text NOT NULL,   -- references the static mosque id from lib/data/mosques.ts
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, mosque_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "follows_select_all"  ON public.follows FOR SELECT USING (true);
CREATE POLICY "follows_insert_auth" ON public.follows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "follows_delete_own"  ON public.follows FOR DELETE USING (auth.uid() = user_id);

-- ─── SEED DATA (optional demo posts) ─────────────────────────
-- You can delete this block after your first real users post content.
-- These use a fixed UUID so the insert is idempotent.

DO $$
DECLARE
  seed_user_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Only seed if the demo profile doesn't exist yet
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = seed_user_id) THEN
    -- Insert a placeholder into auth.users is not allowed directly.
    -- Skip seed if no real users exist yet.
    NULL;
  END IF;
END;
$$;
